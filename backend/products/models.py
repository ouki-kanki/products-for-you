import os
from django.db import models
from django.db.models.signals import pre_save, post_save
from django.utils.html import format_html, html_safe, mark_safe
from django.utils.text import slugify
from django.urls import reverse
from django.core.validators import MaxValueValidator
from django.dispatch import receiver
from django.contrib.postgres.fields import ArrayField
from django.core.files.storage import default_storage
from django.conf import settings


from common.util.static_helpers import upload_icon
from common.util.slugify_helper import slugify_unique
from services.imageServices import generate_thumbnail, generate_thumbnailV2

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
    # slug = models.SlugField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, blank=True)
    parent_category = models.ForeignKey("self", on_delete=models.SET_NULL, related_name='children', blank=True, null=True)
    icon = models.ImageField(upload_to='categories/', blank=True, default='icons/placeholder.jpg')
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    # TODO: maybe this field is usefull
    # is_parent = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "Categories"
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.pk:
            return
        # delete the old img and don't collect garbage
        old_category = Category.objects.get(pk=self.pk)
        old_icon_path = old_category.icon.path
        reference_to_old_icon = old_category.icon
        new_icon = self.icon

        # if user did not upload a new icon return 
        if (reference_to_old_icon == new_icon):
            return

        if default_storage.exists(old_icon_path):
            default_storage.delete(old_icon_path)

        if self.icon:
            icon = generate_thumbnailV2(self, 'icon')
            self.icon = icon

            super().save(*args, **kwargs)
            icon.close()
            return



        super().save(*args, **kwargs)



# NOTE: sender is the class
def category_pre_save(sender, instance, *args, **kwargs):
    if instance.slug is None or instance.slug == "":
        print("inside pre_save", instance.slug)
        instance.slug = slugify(instance.name)


def category_post_save(sender, instance, created, *args, **kwargs):
    if created: 
        instance.save()
    

pre_save.connect(category_pre_save, sender=Category)
post_save.connect(category_post_save, sender=Category)

# TODO: TABLE FOR PRODUCT DETAILS, IMAGES


class Brand(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    features = ArrayField(models.CharField(max_length=255), blank=True, null=True)
    slug = models.SlugField(max_length=50, blank=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    is_featured_product=models.BooleanField(default=False, verbose_name='Featured Product')
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


def product_pre_save(sender, instance, *args, **kwargs):
    if instance.slug == "" or instance.slug is None:
        slugify_unique(sender, instance, instance.name)
        # instance.slug = slugify(instance.name)


def product_post_save(sender, instance, created, *args, **kwargs):
    if created:
        instance.save()


pre_save.connect(product_pre_save, Product)
post_save.connect(product_post_save, Product)


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
    # TODO: change product_id to product because it confusing
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_variations')
    slug = models.SlugField(max_length=50, blank=True)
    sku = models.CharField(max_length=255)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    is_featured = models.BooleanField(default=False)
    variation_option = models.ManyToManyField('variations.VariationOptions') # to avoid circular imports
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    discount = models.ManyToManyField("products.Discount", verbose_name="product_discount")

    @property
    def product_name(self):
        return self.product_id.name

    class Meta:
        verbose_name = "Product Variation"
        db_table_comment = "Variation of Product"

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
    # if is flagged as featured remove the flag from the rest of the variations
    if instance.is_featured:
        other_featured_variations = ProductItem.objects.filter(product_id=instance.product_id, is_featured=True) \
            .exclude(pk=instance.pk)

        if other_featured_variations:
            other_featured_variations.update(is_featured=False)

    if instance.slug is "" or instance.slug is None:
        # TODO: use something like (product-colorvalue) as slug
        slugify_unique(sender, instance, instance.sku)
    
        # instance.slug = slugify(instance.name)
@receiver(post_save, sender=ProductItem)
def product_item_post_save(sender, instance, created, *args, **kwargs):
    if created:
        instance.save()

    
class Banner(models.Model):
    '''
    BANNERS FOR THE LANDING PAGE
    '''
    image = models.CharField(max_length=255)
    alt_text = models.CharField(max_length=255)
        

class ProductImage(models.Model):
    product_item = models.ForeignKey(ProductItem, on_delete=models.CASCADE, related_name='product_image')
    image = models.ImageField(upload_to=upload_product_item_image)
    is_featured = models.BooleanField(default=False)
    has_thumbnail = models.BooleanField(default=False)
    remove_background = models.BooleanField(default=False, help_text="experimental, works with white background")
    thumbnail = models.ImageField(upload_to=upload_product_thumb, blank=True)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.product_item.product_name
    

@receiver(pre_save, sender=ProductImage)
def product_image_pre_save(sender, instance, *args, **kwargs):
    '''
    TODO: the same is used in product item. have to DRY it.
    '''
    if instance.is_featured:
        other_featured_images = ProductImage.objects.filter(product_item=instance.product_item, is_featured=True).exclude(pk=instance.pk)

        if other_featured_images:
            other_featured_images.update(is_featured=False) 


@receiver(post_save, sender=ProductImage)
def product_image_post_save(sender, instance, *args, **kwargs):
    # output_path = os.path.join(settings.MEDIA_ROOT, 'test\\test.png')
    # if instance.remove_background:
        # remove_background(instance.image, output_path)
    if instance.has_thumbnail:
        generate_thumbnail(instance)


class Discount(models.Model):
    '''
    many to many relation with the variant of products
    '''
    code = models.CharField(max_length=255)
    # TODO: change the field with sanitized version of a jsonfield
    description = models.TextField(blank=True)
    # discount_value = models.DecimalField(max_digits=2, decimal_places=2)
    discount_value = models.PositiveBigIntegerField(verbose_name='discount percentage', 
        validators=[
            MaxValueValidator(100, message="max value is 100")
    ])
    discount_type = models.CharField(max_length=255)
    times_used = models.PositiveIntegerField()
    is_active = models.BooleanField(default=False)
    max_times = models.PositiveIntegerField(default=3)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.code} - {self.discount_value}%"





