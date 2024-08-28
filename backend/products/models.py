import os
from io import IOBase
from django.db import models
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

from common.util.static_helpers import upload_icon
from common.util.slugify_helper import slugify_unique
from services.imageServices import (
    generate_thumbnail,
    generate_thumbnailV2,
    remove_background,
    compare_images_delete_prev_if_not_same,
    delete_image_from_filesystem
)
from user_control.models import CustomUser as User

# NOTE: models.PROTECT it seems that does not allow null=True


# HELPERS

# TODO: need to dry this
def upload_category_icon(instance, filename):
    # NOTE: this will save to /images/categoryname/filename
    return upload_icon('category', instance, filename, 'icon', 'name')


# need to provide the folder name in this case use the slug from the parent
def upload_product_item_image(instance, filename):
    variation_name = str(instance.product_item)
    return upload_icon(
        'products',
        instance.product_item.product_id.name,
        variation_name,
        'images',
        instance,
        'image',
        filename)


# uploads to media/product_item/thumbnail/
def upload_product_thumb(instance, filename):
    variation_name = str(instance.product_item)
    return upload_icon(
        'products',
        instance.product_item.product_id.name,
        variation_name,
        'thumbnails',
        instance,
        'thumbnail',
        filename)


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=50, blank=True)
    parent_category = models.ForeignKey("self", on_delete=models.SET_NULL, related_name='children', blank=True, null=True)
    icon = models.ImageField(upload_to='categories/', blank=True, default='icons/placeholder.jpg')
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    position = models.IntegerField(blank=True, default=100,)
    # is_parent = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['position']

    def __str__(self):
        return self.name

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
            # TODO: make a field for the icon and a field for the image . right now there is thumb
            # if self.icon:
                #
                # self.gen_thumb()
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
        print("inside pre_save", instance.slug)
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
                icon = generate_thumbnailV2(self, 'icon', self.name)
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
            icon = generate_thumbnailV2(self, 'icon', self.name)
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
        # instance.slug = slugify(instance.name)

# def product_post_save(sender, instance, created, *args, **kwargs):
#     if created:
#         instance.save()

pre_save.connect(product_pre_save, Product)


# NOT IMPLEMENTED
# NOTE: this is an example of a manager
class VariationManager(models.Manager):
    def all(self):
        # There is no field named "active" this is just for showing the functionality
        return super(VariationManager, self).filter(active=True)

    def sizes(self):
        return super(VariationManager, self).filter(variation_option='size')


class ProductItem(models.Model):
    """
    RPODUCT - VARIANT
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_variations')
    variation_name = models.CharField(max_length=255, blank=True)
    slug = models.SlugField(max_length=50, blank=True, unique=True)
    sku = models.CharField(max_length=255)
    quantity = models.IntegerField()
    detailed_description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    is_default = models.BooleanField(default=False)
    variation_option = models.ManyToManyField('variations.VariationOptions') # to avoid circular imports
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    discount = models.ManyToManyField("products.Discount", verbose_name="product_discount")

    @property
    def product_name(self):
        return self.product.name

    class Meta:
        verbose_name = "Product Variation"
        db_table_comment = "Variation of Product"

    @property
    def variation_name(self): # TODO: find what is this and change it
        qs = self.variation_option.all()
        variation_values = '- '.join(option.value for option in qs)

        return f'{self.product.name} {variation_values}'

    def __str__(self):
        qs = self.variation_option.all()
        # returns the variations joined in a string
        variation_values = ', '.join(option.value for option in qs)
        # return self.product_name
        return f'{self.product_name}, {self.sku}-{variation_values}'

    def __unicode__(self):
        return f"sku - {self.sku} - {self.price} - {self.quantity}"


@receiver(pre_save, sender=ProductItem)
def product_item_pre_save(sender, instance, *args, **kwargs):
    if instance.variation_name == "" or instance.variation_name is None:
        instance.variation_name = "yoyo"
        qs = instance.variation_option.all().first()
        instance.variation_name = f"{instance.product_id.name} {qs}"

    # if is flagged as default remove the flag from the rest of the variations
    if instance.is_default:
        other_default_variations = ProductItem.objects.filter(product=instance.product, is_default=True) \
            .exclude(pk=instance.pk)

        if other_default_variations:
            other_default_variations.update(is_default=False)

    if instance.slug is "" or instance.slug is None:
        slugify_unique(sender, instance, instance.sku)


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
        if self.pk:
            prev_obj = ProductImage.objects.get(pk=self.pk)

            if self.image and self.image != prev_obj.image:

                if prev_obj.image:
                    self.delete_image_and_thumb_from_filesystem(prev_obj, 'image')
                if prev_obj.thumbnail:
                    self.delete_image_and_thumb_from_filesystem(prev_obj, 'thumbnail')

                # NOTE: this will save the thumb only if the user uploads a new file
                # TODO: compare the old bool value with the current and if is dif gen the thum .if the prev was ticked and now the user unticked the value then delete the thumb from the filesystem and also from the database
                if self.has_thumbnail:
                    thumb = generate_thumbnailV2(self, 'image', self.product_item)
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


class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    product = models.ForeignKey(ProductItem, on_delete=models.CASCADE, related_name='favorite_by')

    def __str__(self):
        return f"{self.user.email} - {self.product.product_id.name}"


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
class Stock(models.Model):
    product = models.ForeignKey(ProductItem, on_delete=models.CASCADE, related_name='stock')
    stock = models.PositiveSmallIntegerField()
    items_sold = models.PositiveSmallIntegerField()


class Banner(models.Model):
    """
    BANNERS FOR THE LANDING PAGE
    """
    image = models.CharField(max_length=255)
    alt_text = models.CharField(max_length=255)
