import os
from pathlib import Path
from django.db import models
from django.utils.html import format_html, html_safe, mark_safe

from user_control.models import CustomUser as User

from common.util.static_helpers import upload_icon

# NOTE: models.PROTECT it seems that does not allow null=True


# HELPERS

# TODO: need to dry this
def upload_category_icon(instance, filename):
    # NOTE: this will save to /images/categoryname/filename
    return upload_icon('category', instance, filename)

def upload_product_icon(instance, filename):
    return upload_icon('product', instance, filename)


class Category(models.Model):
    name = models.CharField(max_length=255)
    parent_category = models.ForeignKey("self", on_delete=models.SET_NULL, related_name='children', blank=True, null=True)
    icon = models.ImageField(upload_to=upload_category_icon, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    # TODO: maybe this field is usefull
    # is_parent = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "Categories"

    def image_tag(self):
        if self.icon:
            return format_html('<img src="{}" width="50px" height="50px">', self.icon.url) 
        return 'no icon uploaded'

    def __str__(self):
        return self.name
    

# TODO: TABLE FOR PRODUCT DETAILS, IMAGES

class Brand(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    icon = models.ImageField(upload_to=upload_product_icon, blank=True)

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "1. Products"

    def __str__(self):
        return self.name


# TODO: how can i join with variations?
class ProductItem(models.Model):
    '''
    PRODUCT - VARIANT
    product table - item will have different price in relation with the different variations
    '''
    # TODO: change the name to "product" bacause product_id brings confussion
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_variations')
    sku = models.CharField(max_length=255)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    # to avoid circular imports 
    variation_option = models.ManyToManyField('variations.VariationOptions')
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    # TODO: this hits the database to fetch product. check if it ok to do it that way
    @property
    def product_name(self):
        return self.product_id.name

    class Meta:
        verbose_name = "Product Variation"
        db_table_comment = "Variation of Product"

    def __str__(self):
        return self.product_name
    
    def __unicode__(self):
        return f"sku - {self.sku} - {self.price} - {self.quantity}"
    

class Banner(models.Model):
    '''
    BANNERS FOR THE LANDING PAGE
    '''
    image = models.CharField(max_length=255)
    alt_text = models.CharField(max_length=255)
        



