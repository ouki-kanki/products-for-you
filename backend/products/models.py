from io import BytesIO

from django.db import models
from django.db.models.signals import pre_save, post_save
from django.utils.html import format_html, html_safe, mark_safe
from django.utils.text import slugify
from django.urls import reverse
from django.core.validators import MaxValueValidator
from django.core.files import File
from django.dispatch import receiver

from common.util.static_helpers import upload_icon
from common.util.slugify_helper import slugify_unique

from PIL import Image

# NOTE: models.PROTECT it seems that does not allow null=True


# HELPERS

# TODO: need to dry this
def upload_category_icon(instance, filename):
    # NOTE: this will save to /images/categoryname/filename
    return upload_icon('category', instance, filename)

def upload_product_icon(instance, filename):
    return upload_icon('product', instance, filename)


def upload_product_item_image(instance, filename):
    return upload_icon('product_item', instance, filename)



class Category(models.Model):
    name = models.CharField(max_length=255)
    # slug = models.SlugField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, blank=True)
    parent_category = models.ForeignKey("self", on_delete=models.SET_NULL, related_name='children', blank=True, null=True)
    icon = models.ImageField(upload_to=upload_category_icon, blank=True, default='icons/placeholder.jpg')
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    # TODO: maybe this field is usefull
    # is_parent = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "Categories"
    
    def __str__(self):
        return self.name
    
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
    slug = models.SlugField(max_length=50, blank=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    icon = models.ImageField(upload_to=upload_product_icon, blank=True, default='icons/placeholder.jpg')

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "1. Products"

    @property
    def get_absolute_url_v1(self):
        return reverse("products:product_detail", kwargs={"slug": self.slug})
    
    @property
    def get_absolute_url(self):
        return f'/{self.category.slug}/{self.slug}/'
    
    def __str__(self):
        return self.name


def product_pre_save(sender, instance, *args, **kwargs):
    if instance.slug is "" or instance.slug is None:
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
    '''
    PRODUCT - VARIANT
    '''
    # TODO: change product_id to product because it confusing
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_variations')
    slug = models.SlugField(max_length=50, blank=True)
    sku = models.CharField(max_length=255)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    is_featured = models.BooleanField(default=False)
    # to avoid circular imports 
    variation_option = models.ManyToManyField('variations.VariationOptions')
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
        variation_value = ', '.join(option.value for option in qs)
        # return self.product_name
        return f'{self.product_name} sku: {self.sku} - {variation_value}'
    
    def __unicode__(self):
        return f"sku - {self.sku} - {self.price} - {self.quantity}"

# NOTE: used decorator instead of connect 
@receiver(pre_save, sender=ProductItem)
def product_item_pre_save(sender, instance, *args, **kwargs):
    # if is flagged as featured remove the flag from the rest of the variations
    if instance.is_featured:
        print("inside the featured override")
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
    featured = models.BooleanField(default=False)
    thumbnail = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.product_item.product_name
    
    def get_image(self):
        if self.image:
            # TODO: import the base url and use it 
            # this simplifies the url for the client
            return 'http://127.0.0.1:8000' + self.image.url
        return 'there is no image provided'
    
    def get_thumbnail(self):
        if self.image and self.thumbnail:
            return self.generate_thumbnail(self.image)
        # TODO: change the thumbnail field to (hasThumbnail) and then 
        # create a thumbnail image field and to the below
        # self.thumbnail = self.generate_thumbnail(self.image)
        # self.save to save to the database
        # return 'http://127.0.0:8000' + self.thumbnail.url
        else:
            return 'there is no provided image'
        
    def generate_thumbnail(self, image, size=(300, 200)):
        img = Image.open(image)
        img.convert('RGB')
        img.thumbnail(size)

        thumb_io = BytesIO()
        img.save(thumb_io, 'JPEG', quality=85)

        thumbnail = File(thumb_io, name=image.name)
        return thumbnail


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





