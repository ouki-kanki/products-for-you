from django.contrib import admin
from django.conf import settings
from django.db import models
from django import forms

from .models import (
    Product, 
    ProductItem, 
    Category, 
    Brand, 
    Discount,
    ProductImage
)
from common.util.static_helpers import render_icon
from widgets.custom_admin_widgets import CustomAdminFileWidget


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('product_icon', 'name', 'slug')
    # list_editable = ['name']
    readonly_fields = ('product_icon',)

    formfield_overrides = {
        models.ImageField: { 'widget': CustomAdminFileWidget }
    }
    
    def product_icon(self, obj):
        return render_icon(obj)

# Register your models here.


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('product_icon', 'name', 'slug', 'brand')

    formfield_overrides = {
    models.ImageField: { 'widget': CustomAdminFileWidget }
    }

    def product_icon(self, obj):
        return render_icon(obj)
    
@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_value', 'discount_type', 'is_active', 'created_at', )



class ProductItemSelect(forms.Select):
    def create_option(
        self, name, value, label, selected, index, subindex=None, attrs=None
    ):
        option = super().create_option(
            name, value, label, selected, index, subindex, attrs
        )
        if value:
            option["attrs"]["product_variation"] = value.instance.sku
        return option




@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    # form = ProductImageForm
    list_display = ('product_item', 'image', 'featured', 'thumbnail',)

admin.site.register((ProductItem, Brand),)

