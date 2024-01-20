from typing import Any
from django.contrib import admin, messages
from django.conf import settings
from django.db import models
from django import forms
from django.http.request import HttpRequest
from django.http.response import HttpResponse
from django.utils.safestring import mark_safe
from django.utils.html import strip_tags

from services.imageServices import delete_image_from_filesystem

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

from .fields.admin_fields import FeaturesField

admin.site.site_title = 'products-for-you admin'
admin.site.site_header = 'Products For You Administration'


# TODO: move all the forms to a seperate file
class CategoryAdminForm(forms.ModelForm):
    icon_name = forms.CharField(required=False)

    class Meta:
        model = Category
        fields = '__all__'

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'product_icon', 'slug', 'parent_category', 'created_at')
    readonly_fields = ('product_icon',)
    actions = ('delete_categories',)
    form = CategoryAdminForm
    ordering = ['position']
    # sortable_by = ['position', ]

    formfield_overrides = {
        models.ImageField: { 'widget': CustomAdminFileWidget }
    }
    
    def product_icon(self, obj):
        return render_icon(obj, 'icon')
    
    def delete_categories(self, request, queryset):
        """
        remove the records and the images from disk
        """
        for obj in queryset:
            if obj.icon:
                delete_image_from_filesystem(obj, 'icon')
        # run the default del
        queryset.delete()
    
    # NOT WORKING FOR NOW 
    def response_change(self, request: HttpRequest, obj: Any) -> HttpResponse:
        """
        change the name of the imageFile on the disk.
        - deactivated for now - 
        NOTE: needs debugging (it seems there is conflict with the mechanism in the models that removes the old file and replaces it with new)
        """
        icon_name = request.POST.get('icon_name', '')

        if icon_name and obj.icon:
            obj.icon.name = icon_name
            # obj.save()

        return super().response_change(request, obj)

# Register your models here.

class ProductItemInline(admin.TabularInline):
    model = ProductItem
    # extra 0 will remove the ability to add variations inside tha product admin panel
    extra = 1    


class ProductForm(forms.ModelForm):
    features = FeaturesField() # NOTE: this corresponds to the name of the field in the database
    
    def __init__(self, *args, **kwargs):
        super(ProductForm, self).__init__(*args, **kwargs)

        self.fields['features'].widget.attrs['placeholder'] = "insert comma seperated values. ex: foo, bar, "
    
    class Meta:
        model = Product
        fields = "__all__"


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'product_icon', 'slug', 'brand', 'is_featured_product', 'created_at',)
    list_filter = ('is_featured_product', )
    inlines = [ProductItemInline]
    actions = ('delete_products', )
    form = ProductForm
    message = "Warning.There are no variations for this product.please provide at least one variation"
    no_featured_warning = "Warning. please provide a featured variation"

    formfield_overrides = {
    models.ImageField: { 'widget': CustomAdminFileWidget },
    # ArrayField: { 'widget': FeaturesField }
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
        super().save_model(request, obj, form, change) 

    def delete_products(self, request, queryset):
        for obj in queryset:
            if obj.icon:
                delete_image_from_filesystem(obj, 'icon')
        queryset.delete()
    
@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_value', 'discount_type', 'is_active', 'created_at', )

  
@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('product_item', 'product_image', 'is_featured', 'has_thumbnail')
    list_filter = ('product_item', )
    exclude = ('thumbnail', )
    ordering = ('product_item',)
    actions = ('delete_record_and_images',)

    
    formfield_overrides = {
        models.ImageField: { 'widget': CustomAdminFileWidget }
    }

    def product_image(self, obj):
        return render_icon(obj, 'image')
        
    def delete_record_and_images(self, request, queryset):
        """
        remove the images from disk and then delete the record
        """
        for obj in queryset:
            if obj.image:
                delete_image_from_filesystem(obj, 'image')
            if obj.thumbnail:
                delete_image_from_filesystem(obj, 'thumbnail')
        
        queryset.delete()


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    exclude = ['thumbnail',]
    extra = 1  


@admin.register(ProductItem)
class ProductItemAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'id', 'product_id', 'quantity_formated', 'get_category')
    list_select_related = ('product_id', )
    # list_display_links = ('product_id',)
    list_filter = ('product_id', 'quantity')
    inlines = [ProductImageInline, ]

    @staticmethod
    def format_qnt(quantity, color):
        return mark_safe(f'<span style="color: {color};">{quantity}</span>')

    @admin.display(description="yoyo", ordering='quantity')
    def quantity_formated(self, obj):
        quantity = obj.quantity
        if quantity == 0:
            return self.format_qnt(quantity, 'red')
        if quantity < 3:
            return self.format_qnt(quantity, 'yellow')
        else:
            return quantity
        
    quantity_formated.short_description = 'Quantity'

    def get_category(self, obj):
        return obj.product_id.category
    
    get_category.short_description = 'Category'


admin.site.register((Brand),)

