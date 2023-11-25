from django.contrib import admin
from django.conf import settings
from django.db import models

from .models import Product, ProductItem, Category, Brand, Discount

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
    list_display = ('code', 'discount_value', 'discount_type')

admin.site.register((ProductItem, Brand, ),)