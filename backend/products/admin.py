from typing import Any
from django.contrib import admin, messages
from django.conf import settings
from django.db import models
from django import forms
from django.http.request import HttpRequest
from django.contrib.postgres.fields import ArrayField


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

admin.site.site_title = 'products-for-you admin'
admin.site.site_header = 'Products For You Administration'

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'product_icon', 'slug')
    # list_editable = ['name']
    readonly_fields = ('product_icon',)

    formfield_overrides = {
        models.ImageField: { 'widget': CustomAdminFileWidget }
    }
    
    def product_icon(self, obj):
        return render_icon(obj, 'icon')

# Register your models here.

class ProductItemInline(admin.TabularInline):
    model = ProductItem
    # extra 0 will remove the ability to add variations inside tha product admin panel
    extra = 1    

class ProductForm(forms.ModelForm):
    features = forms.CharField(widget=forms.Textarea())

    class Meta:
        model = Product
        fields = "__all__"

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'product_icon', 'slug', 'brand', 'is_featured_product')
    list_filter = ('is_featured_product', )
    inlines = [ProductItemInline]
    form = ProductForm
    message = "Warning.There are no variations for this product.please provide at least one variation"
    no_featured_warning = "Warning. please provide a featured variation"

    formfield_overrides = {
    models.ImageField: { 'widget': CustomAdminFileWidget },
    }

    
    def changeform_view(self, request: HttpRequest, object_id: str | None = ..., form_url: str = ..., extra_context: dict[str, bool] | None = ...) -> Any:
        product_items = ProductItem.objects.filter(product_id=object_id)
        isFeaturedExists = product_items.filter(is_featured=True)
        if not isFeaturedExists:
            self.message_user(request, self.no_featured_warning, level=messages.WARNING)

        if not product_items:
            self.message_user(request, self.message, level=messages.WARNING)

        return super().changeform_view(request, object_id, form_url, extra_context)

    def product_icon(self, obj):
        return render_icon(obj, 'icon')
    
    def save_model(self, request: Any, obj: Any, form: Any, change: Any) -> None:
        super().save_model(request, obj, form, change)

        if not obj.product_variations.exists():
            self.message_user(request, self.message, level=messages.WARNING)

        
    
@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_value', 'discount_type', 'is_active', 'created_at', )


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    # form = ProductImageForm
    list_display = ('product_item', 'product_image', 'is_featured', 'has_thumbnail')
    exclude = ('thumbnail', )
    ordering = ('product_item',)
    
    formfield_overrides = {
        models.ImageField: { 'widget': CustomAdminFileWidget }
    }

    def product_image(self, obj):
        return render_icon(obj, 'image')


@admin.register(ProductItem)
class ProductItemAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'product_id', 'get_category')
    list_select_related = ('product_id', )
    # list_display_links = ('product_id',)
    list_filter = ('product_id',)

    def get_category(self, obj):
        return obj.product_id.category
    
    get_category.short_description = 'Category'


admin.site.register((Brand),)

