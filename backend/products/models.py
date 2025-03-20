import os
import uuid
from io import IOBase
from django.db import models, transaction
from django.db.models.signals import pre_save, post_save
from django.utils.html import format_html, html_safe, mark_safe
from django.utils.text import slugify
from django.urls import reverse
from django.core.validators import MaxValueValidator
from django.dispatch import receiver
from django.contrib.postgres.fields import ArrayField
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.exceptions import SuspiciousFileOperation
from django.core.validators import MinValueValidator, MaxValueValidator

from common.util.string_utils import replace_space_with_dash

from common.util.static_helpers import (
    upload_icon, upload_product_item_image,
    upload_product_thumb, upload_category_icon
)
from common.util.slugify_helper import slugify_unique, lower_random
from services.imageServices import (
    generate_thumbnail_v2,
    remove_background,
    compare_images_delete_prev_if_not_same,
    delete_image_from_filesystem
)
from user_control.models import CustomUser as User

from .utils import get_list_of_parent_categories


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=50, blank=True)
    parent_category = models.ForeignKey("self", on_delete=models.SET_NULL, related_name='children', blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    icon = models.ImageField(upload_to='categories/', blank=True, default='icons/placeholder.jpg')
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    position = models.IntegerField(blank=True, default=100,)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['position']

    def __str__(self):
        return self.name

    # TODO: do not allow more than 20 featured categories


    def gen_thumb(self):
        pass
        # icon = generate_thumbnailV2(self, 'icon', self.name)
        # self.icon = icon
        # if isinstance(icon, IOBase):
            # icon.close()

    def save(self, *args, **kwargs):
        if not self.pk:
            max_position = Category.objects.aggregate(models.Max('position'))['position__max'] or 1
            self.position = max_position + 1
            super().save(*args, **kwargs)
        else:
            prev_category_obj = Category.objects.get(pk=self.pk)
            is_same = compare_images_delete_prev_if_not_same(self, prev_category_obj, 'icon')

            if not is_same:
                if self.icon:
                    pass
                    # self.gen_thumb()

            # swap the position with the category that has the new position if it exist
            old_position = Category.objects.get(pk=self.pk).position
            if old_position != self.position:
                # find the item with the new_position that user provided
                category_with_new_position_exists = Category.objects.filter(position=self.position).exists()

                # otherwise it will attribute error if there isn't instance
                if category_with_new_position_exists:
                    Category.objects.filter(position=self.position).update(position=old_position)

            super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if self.icon:
            delete_image_from_filesystem(self, 'icon')
        super().delete(*args, **kwargs)


# NOTE: sender is the class
def category_pre_save(sender, instance, *args, **kwargs):
    if instance.slug is None or instance.slug == "":
        instance.slug = slugify(instance.name)


# def category_post_save(sender, instance, created, *args, **kwargs):
#     if created:
#         instance.save()


pre_save.connect(category_pre_save, sender=Category)
# post_save.connect(category_post_save, sender=Category)

# TODO: TABLE FOR PRODUCT DETAILS, IMAGES


class Brand(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    icon = models.ImageField(upload_to='brands/', blank=True, default='icons/placeholder.jpg')

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    features = ArrayField(models.CharField(max_length=255), default=list, blank=True, null=True)
    slug = models.SlugField(max_length=50, blank=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    is_featured = models.BooleanField(default=False, verbose_name='Featured Product')
    icon = models.ImageField(upload_to='products/icons/', blank=True, default='icons/placeholder.jpg')

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "1. Products"

    @property
    def get_absolute_url_v1(self):
        return reverse("products:product_detail", kwargs={"slug": self.slug})

    @property
    def get_absolute_url(self):
        # TODO: have to do this recursivelly because the parent category may have parent category also
        return f'/{self.category.slug}/{self.slug}/'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # this will trigger if this is first created instance so we do not need to clear the filesystem
        if not self.pk:
            if self.icon:
                icon = generate_thumbnail_v2(self, 'icon', self.name)
                self.icon = icon
                if isinstance(icon, IOBase):
                    icon.close()
            super().save(*args, **kwargs)
            return
        # it did not save yet. we fetch from the database the prev obj
        prev_obj = Product.objects.get(pk=self.pk)
        is_same = compare_images_delete_prev_if_not_same(self, prev_obj, 'icon')

        # the case that user did not upload a new icon and just hit save
        if is_same:
            super().save(*args, **kwargs)
            return

        if self.icon:
            icon = generate_thumbnail_v2(self, 'icon', self.name)
            self.icon = icon
            if isinstance(icon, IOBase):
                icon.close()
            super().save(*args, **kwargs)
            return

        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if self.icon:
            delete_image_from_filesystem(self, 'icon')
        super().delete(*args, **kwargs)


def product_pre_save(sender, instance, *args, **kwargs):
    if instance.slug == "" or instance.slug is None:
        slugify_unique(sender, instance, instance.name)


pre_save.connect(product_pre_save, Product)


class FeaturedItem(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='featured_item')
    position = models.PositiveIntegerField(unique=True)

    def __str__(self):
        return f'{self.product}-{self.position}'


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True)

    def __str__(self):
        return self.slug


class ProductItem(models.Model):
    """ PRODUCT - VARIANT """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_variations')
    variation_name = models.CharField(max_length=255, blank=True)
    slug = models.SlugField(max_length=50, blank=True, unique=True)
    sku = models.CharField(max_length=255, blank=True, unique=True)
    quantity = models.PositiveIntegerField()
    detailed_description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    is_default = models.BooleanField(default=False)
    variation_option = models.ManyToManyField('variations.VariationOptions')  # to avoid circular imports
    generate_tags = models.BooleanField(default=False, help_text='this will gather info about the product and will try to create assosiated tags')
    tags = models.ManyToManyField(Tag, related_name='product_items', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    limited_number_of_items_threshold = models.PositiveIntegerField(default=3,
                                                                    help_text='below and including this number'
                                                                              ' number of items"')

    class Meta:
        verbose_name = "Product Variation"
        db_table_comment = "Variation of Product"

    @property
    def product_name(self):
        return self.product.name

    @property
    def categories(self):
        list_of_categories = get_list_of_parent_categories(self.product.category, [])
        return list_of_categories

    @property
    def variation_name(self):  # noqa
        """
        format product_name-variation_values
        used to save the thumb of product variation to the filesystem as name for the file
        """
        qs = self.variation_option.all()
        variation_values = '- '.join(option.value for option in qs)
        product_name = self.product_name.replace(' ', '-')

        return f'{product_name}-{variation_values}'

    @property
    def availability(self):
        quantity = self.quantity
        threshold = self.limited_number_of_items_threshold
        if quantity > threshold:
            return 'available'
        elif quantity > 0:
            return 'limited quantity'
        return 'not available'

    @property
    def build_url_path(self):
        category_slug = slugify(self.product.category.name)
        product_slug = slugify(self.product.name)

        return f"{category_slug}/{product_slug}"

    def __str__(self):
        qs = self.variation_option.all()
        # returns the variations joined in a string
        variation_values = ', '.join(option.value for option in qs)
        # return self.product_name
        return f'{self.product_name}, {self.sku}-{variation_values}'

    def __unicode__(self):
        return f"sku - {self.sku} - {self.price} - {self.quantity}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.pk and self.generate_tags:
            tag_names = set()

            if self.product.category:
                tag_names.add(self.product.category.name.strip())

            for variation in self.variation_option.all():
                tag_names.add(variation)

            for tag_name in tag_names:
                tag, _ = Tag.objects.get_or_create(name=tag_name, slug=slugify(tag_name))
                self.tags.add(tag)
            
            self.generate_tags = False
            super().save(*args, **kwargs)


@receiver(pre_save, sender=ProductItem) # noqa
def product_item_pre_save(sender, instance, *args, **kwargs):
    # if this instance is default remove is_default from other instances
    if instance.is_default:
        other_default_variations = ProductItem.objects.filter(product=instance.product, is_default=True) \
            .exclude(pk=instance.pk)

        if other_default_variations:
            other_default_variations.update(is_default=False)

@receiver(post_save, sender=ProductItem) # noqa
def product_item_post_save(sender, instance, created, **kwargs):
    # if created and (instance.slug is None or instance.slug == ''):
    if instance.generate_tags:
        tag_names = set()

        if instance.product.category:
            tag_names.add(instance.product.category.name.strip())




    def generate_slug_and_sku():
        need_generate = False
        if instance.slug is None or instance.slug == '':
            # variation_values = '-'.join([variation.value[:3] for variation in variation_options_qs])
            slug = slugify(instance.variation_name)

            instance_with_same_slug = sender.objects.filter(slug=slug).exclude(id=instance.id)
            if instance_with_same_slug.exists():
                slug = f'{slug}-{lower_random(4)}-{lower_random(4)}'
            instance.slug = slug
            need_generate = True

        if instance.sku is None or instance.sku == '':
            options_qs = instance.variation_option.all()
            variation_values = '- '.join(option.value[:3] for option in options_qs)

            random_number = uuid.uuid4().hex[:8]
            # TODO: if the product name is multiple words use the first letters from each word
            sku = f'{instance.product.category.name[:3]}-{instance.product_name[:3]}-{variation_values}-{random_number}'
            sku = replace_space_with_dash(sku)
            instance.sku = sku
            need_generate = True

        if need_generate:
            instance.save()

    transaction.on_commit(generate_slug_and_sku)


class ProductDetail(models.Model):
    product_item = models.OneToOneField(ProductItem, on_delete=models.CASCADE, related_name='product_details')
    width = models.DecimalField(max_digits=5, decimal_places=1, help_text="measurement in cm")
    height = models.DecimalField(max_digits=5, decimal_places=1, help_text="measurement in cm")
    length = models.DecimalField(max_digits=5, decimal_places=1, help_text="measurement in cm")
    weight = models.IntegerField(null=True, help_text="weight in grams")

    @property
    def volume(self):
        return self.length * self.width * self.height

    def __str__(self):
        # TODO: change if it causes performance problems
        return f"details for product {self.product_item.product.name}"


class ProductImage(models.Model):
    product_item = models.ForeignKey(ProductItem, on_delete=models.CASCADE, related_name='product_image')
    image = models.ImageField(upload_to=upload_product_item_image)
    is_default = models.BooleanField(default=False)
    has_thumbnail = models.BooleanField(default=False)
    remove_background = models.BooleanField(default=False, help_text="experimental, works with white background")
    thumbnail = models.ImageField(upload_to=upload_product_thumb, blank=True)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.product_item.product_name

    @staticmethod
    def delete_image_and_thumb_from_filesystem(instance, field_name: str):
        image_ref = getattr(instance, field_name)
        img_path = image_ref.path

        # TODO: handle the exceptions
        try:
            default_storage.delete(img_path)
        except SuspiciousFileOperation:
            print("not found")
        except Exception as e:
            print("there was an error", e)

    def save(self, *args, **kwargs):

        # if there was an instance before delete old image and thumb
        if self.pk:
            prev_obj = ProductImage.objects.get(pk=self.pk)

            if self.image and self.image != prev_obj.image:

                if prev_obj.image:
                    self.delete_image_and_thumb_from_filesystem(prev_obj, 'image')
                if prev_obj.thumbnail:
                    self.delete_image_and_thumb_from_filesystem(prev_obj, 'thumbnail')

        # if thumbnail is checked create a thumb
        if self.has_thumbnail:
            thumb = generate_thumbnail_v2(self, 'image', self.product_item.variation_name)
            self.thumbnail = thumb

        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if self.image:
            delete_image_from_filesystem(self, 'image')

        if self.thumbnail:
            delete_image_from_filesystem(self, 'thumbnail')

        super().delete(*args, **kwargs)


@receiver(pre_save, sender=ProductImage)
def product_image_pre_save(sender, instance, *args, **kwargs):
    """
    TODO: the same is used in product item. have to DRY it.
    """
    if instance.is_default:
        other_default_images = ProductImage.objects.filter(product_item=instance.product_item, is_default=True).exclude(pk=instance.pk)

        if other_default_images:
            other_default_images.update(is_default=False)


@receiver(post_save, sender=ProductImage)
def product_image_post_save(sender, instance, *args, **kwargs):
    output_path = os.path.join(settings.MEDIA_ROOT, 'test\\test.png')
    if instance.remove_background:
        remove_background(instance.image, output_path)





# *** OBSOLETE ***
class Discount(models.Model):
    """
    many to many relation with the variant of products
    """
    code = models.CharField(max_length=255)
    # TODO: change the field with sanitized version of a jsonfield
    description = models.TextField(blank=True)
    # discount_value = models.DecimalField(max_digits=2, decimal_places=2)
    discount_value = models.PositiveBigIntegerField(verbose_name='discount percentage',
        validators=[
            MaxValueValidator(100, message="max value is 100")
    ])
    discount_type = models.CharField(max_length=255)
    times_used = models .PositiveIntegerField()
    is_active = models.BooleanField(default=False)
    max_times = models.PositiveIntegerField(default=3)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.code} - {self.discount_value}%"


class FavoriteProductItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    product_item = models.ForeignKey(ProductItem, on_delete=models.CASCADE, related_name='favorite_by')

    class Meta:
        unique_together = ('user', 'product_item')

    def __str__(self):
        return f"{self.user.email} - {self.product_item.product.name}"


class ProductReview(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_ratings')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_ratings')
    description = models.TextField(blank=True, default='')
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    # NOTE: these validators are not a db constrain.
    
    def __str__(self):
        return f"{self.user.email} - {self.product.name} - {self.rating}"


# NOT IMPLEMENTED


class Banner(models.Model):
    """
    BANNERS FOR THE LANDING PAGE
    """
    image = models.CharField(max_length=255)
    alt_text = models.CharField(max_length=255)
