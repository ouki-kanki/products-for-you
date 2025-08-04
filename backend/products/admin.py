from io import BytesIO
from typing import Any
from django import forms
from django.contrib import admin, messages
from django.core.files.base import ContentFile
from django.db import models
from django.db.models import Q
from django.http.request import HttpRequest
from django.http.response import HttpResponse
from django.utils import timezone
from django.utils.safestring import mark_safe
from django.utils.html import format_html
from django.urls import reverse

from rembg import remove

from services.imageServices import delete_image_from_filesystem
from common.util.static_helpers import render_icon
from promotion.models import ProductsOnPromotion
from widgets.custom_admin_widgets import CustomAdminFileWidget


from .models import (
    Product,
    ProductItem,
    Category,
    Brand,
    ProductImage,
    FeaturedItem,
    ProductDetail,
    Tag
)

from .fields.admin_fields import FeaturesField


admin.site.site_title = 'products-for-you admin'
admin.site.site_header = 'Products For You Administration'


# TODO: move all the forms to a seperate file
class CategoryAdminForm(forms.ModelForm):
    icon_name = forms.CharField(required=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        instance = kwargs.get('instance')

        if instance and not instance.is_leaf:
            self.fields['rating_aspects_group'].disabled = True
            self.fields['rating_aspects_group'].help_text = "can only add aspects if the category has no children categories"

    class Meta:
        model = Category
        fields = '__all__'

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'product_icon', 'is_featured',
                    'slug', 'parent_category', 'has_related_products', 'created_at')
    readonly_fields = ('product_icon',)
    actions = ('delete_categories',)
    form = CategoryAdminForm
    ordering = ['position']
    # sortable_by = ['position', ]

    formfield_overrides = {
        models.ImageField: {'widget': CustomAdminFileWidget}
    }

    def has_related_products(self, obj):
        return 'Yes' if obj.products.exists() else mark_safe('<span style=\'color:tomato;\'>No</span>')

    def product_icon(self, obj):
        return render_icon(obj, 'icon')

    @staticmethod
    def delete_categories(request, queryset):
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
        NOTE: needs debugging (it seems there is
        conflict with the mechanism in the models that removes the old file and replaces it with new)
        """
        icon_name = request.POST.get('icon_name', '')

        if icon_name and obj.icon:
            obj.icon.name = icon_name
            # obj.save()

        return super().response_change(request, obj)


class FeaturedItemInlineForm(forms.ModelForm):
    class Meta:
        model = FeaturedItem
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        print("the primary key", self.instance.pk)
        if not self.instance.pk:
            last_position_obj = FeaturedItem.objects.order_by('-position').first()
            print(last_position_obj.position)
            last_position = last_position_obj.position
            if last_position:
                self.fields['position'].initial = last_position + 1
            else:
                self.fields['position'].initial = 1


class FeaturedItemInline(admin.TabularInline):
    model = FeaturedItem
    extra = 1
    form = FeaturedItemInlineForm


class ProductItemInline(admin.TabularInline):
    model = ProductItem
    readonly_fields = ['variation_link']
    # extra 0 will remove the ability to add variations inside tha product admin panel
    extra = 1

    def variation_link(self, obj):
        if obj.pk:
            url = reverse('admin:products_productitem_change', args=[obj.pk])
            return format_html('<a href="{}">{}</a>', url, obj.variation_name)

    def get_fields(self, request, obj=None):
        fields = ['variation_link'] + list(super().get_fields(request, obj=obj))
        return fields


class ProductForm(forms.ModelForm):
    features = FeaturesField()  # NOTE: this corresponds to the name of the field in the database

    def __init__(self, *args, **kwargs):
        super(ProductForm, self).__init__(*args, **kwargs)

        self.fields['features'].widget.attrs['placeholder'] = "insert comma seperated values. ex: foo, bar, "

    class Meta:
        model = Product
        fields = "__all__"

    class Media:
        js = ('js/toggle_featured.js',)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'product_icon', 'slug', 'brand', 'is_featured', 'created_at',)
    list_filter = ('is_featured', )
    # inlines = [ProductItemInline, FeaturedItemInline]
    inlines = [FeaturedItemInline, ProductItemInline]
    actions = ('delete_products', )
    form = ProductForm
    message = "Warning.There are no variations for this product.please provide at least one variation"
    no_featured_warning = "Warning. please provide a default variation"

    formfield_overrides = {models.ImageField: {'widget': CustomAdminFileWidget}, }

    def changeform_view(
            self, request: HttpRequest, object_id: str | None = ...,
            form_url: str = ..., extra_context: dict[str, bool] | None = ...) -> Any:
        product_items = ProductItem.objects.filter(product=object_id)
        isFeaturedExists = product_items.filter(is_default=True)
        if not isFeaturedExists:
            self.message_user(request, self.no_featured_warning, level=messages.WARNING)

        if not product_items:
            self.message_user(request, self.message, level=messages.WARNING)

        return super().changeform_view(request, object_id, form_url, extra_context)

    def product_icon(self, obj):
        return render_icon(obj, 'icon')

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)
        product_instance = form.instance

        if form.instance.is_featured:
            new_position = None
            for formset in formsets:
                if formset.model == FeaturedItem:
                    for form in formset.forms:
                        new_position_raw = request.POST.get(form.add_prefix('position'))
                        new_position = int(new_position_raw) if new_position_raw else None

            try:
                featured_item = FeaturedItem.objects.get(product=product_instance)
                old_position = featured_item.position
                print("the old position ", old_position)
                print("the new position", new_position)
                if old_position != new_position:
                    # super().save_related(request, form, formsets, change)
                    featured_item.position = new_position
                    featured_item.save()
            except FeaturedItem.DoesNotExist:
                # super().save_related(request, form, formsets, change)
                FeaturedItem.objects.create(
                    product=product_instance,
                    position=new_position
                )

        else:
            try:
                featured_item = FeaturedItem.objects.get(product=product_instance)
                featured_item.delete()
            except FeaturedItem.DoesNotExist:
                pass
        # super().save_related(request, form, formsets, change)

    def save_model(self, request: Any, obj: Any, form: Any, change: Any) -> None:
        super().save_model(request, obj, form, change)

        if not obj.product_variations.exists():
            self.message_user(request, self.message, level=messages.WARNING)
        # super().save_model(request, obj, form, change)

    @staticmethod
    def delete_products(request, queryset):
        for obj in queryset:
            if obj.icon:
                delete_image_from_filesystem(obj, 'icon')
        queryset.delete()


class FeaturedItemForm(forms.ModelForm):
    class Meta:
        model = FeaturedItem
        fields = '__all__'

    def validate_unique(self):
        pass


@admin.register(FeaturedItem)
class FeaturedItemAdmin(admin.ModelAdmin):
    form = FeaturedItemForm
    list_display = ('product', 'position',)
    ordering = ('position',)

    def change_view(self, request, object_id, form_url="", extra_context=None):
        extra_context = extra_context or {}
        if extra_context:
            extra_context['custom_message'] = format_html(
                '<div>__test__</div>'
            )
        return super().change_view(request, object_id, form_url, extra_context)

    def save_model(self, request, obj, form, change):
        if change:
            old_position = FeaturedItem.objects.get(pk=obj.pk).position
            new_position = obj.position

            try:
                # find a position that does not exist to use to avoid the constrain error
                item_with_same_position = FeaturedItem.objects.get(position=new_position)
                last_position_used = FeaturedItem.objects.order_by('-position').first().position
                setattr(item_with_same_position, 'position', last_position_used + 1)
                item_with_same_position.save()

                # save the current instance with the new position
                super().save_model(request, obj, form, change)
                # save the instance with the same position and now use the old_position to do the swap
                setattr(item_with_same_position, 'position', old_position)
                item_with_same_position.save()
                return
            except FeaturedItem.DoesNotExist:
                pass

        super().save_model(request, obj, form, change)


class ProductImageForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(ProductImageForm, self).__init__(*args, **kwargs)
        self.fields['is_default'].help_text = "it will used to show the thumbnail of the variation " \
                                              "in product preview and the main image for the product"


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('product_item', 'product_image', 'is_default', 'has_thumbnail')
    list_filter = ('product_item', )
    exclude = ('thumbnail', )
    ordering = ('product_item',)
    actions = ('delete_record_and_images',)
    form = ProductImageForm

    formfield_overrides = {
        models.ImageField: {'widget': CustomAdminFileWidget}
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


class ProductImageInlineForm(forms.ModelForm):
    remove_background_action = forms.BooleanField(required=False, label='Remove Background')
    revert_action = forms.BooleanField(required=False, label='return to the original')

    class Meta:
        model = ProductImage
        fields = ('is_default', 'has_thumbnail', 'image', 'remove_background_action', 'revert_action')

    def save(self, commit=True):
        instance = super().save(commit=False)

        if self.cleaned_data.get('remove_background_action'):
            if instance.image:
                img_data = instance.image.read()
                output = remove(img_data)

                output_image = BytesIO(output)
                new_image = ContentFile(output_image.getvalue(), name=f'{instance.pk}_no_bg.png')
                instance.image.save(new_image.name, new_image, save=False)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    readonly_fields = ['product_image', 'product_thumb']
    exclude = ['thumbnail',]  # TODO: if there is need for custom thump
    # remove this but have to inform that thumb is generated automatically
    extra = 1
    # form = ProductImageInlineForm

    def product_image(self, obj):  # noqa
        return render_icon(obj, 'image')

    def product_thumb(self, obj): # noqa
        return render_icon(obj, 'thumbnail')

    class Media:
        js = ('js/remove_bg.js',)


class PromotionsInline(admin.TabularInline):
    model = ProductsOnPromotion
    extra = 0
    verbose_name_plural = 'Active Promotions'
    # fk_name = 'product_item_id'


class ProductItemForm(forms.ModelForm):
    class Meta:
        model = ProductItem
        fields = '__all__'


class ProductDetailInline(admin.TabularInline):
    model = ProductDetail
    extra = 0


@admin.register(ProductItem)
class ProductItemAdmin(admin.ModelAdmin):
    list_display = (
        '__str__', 'variation_name', 'slug', 'id', 'get_default_image',
        'product', 'quantity_formated', 'get_category',
        'active_promotion',
        'limited_number_of_items_threshold',
    )
    list_select_related = ('product', )
    list_filter = ('product', 'quantity')
    inlines = [ProductImageInline, PromotionsInline, ProductDetailInline]
    form = ProductItemForm

    def active_promotion(self, obj): # noqa
        promotions = obj.product_inventory.select_related('promotion_id').all()

        active_promotions = [
            item.promotion_id.name for item in promotions
            if item.promotion_id.is_active
            ]

        return ', '.join(active_promotions) if active_promotions else '-'

    @staticmethod
    def format_qnt(quantity, color):
        return mark_safe(f'<span style="color: {color};">{quantity}</span>')

    @admin.display(description="__test__", ordering='quantity')
    def quantity_formated(self, obj):  # noqa
        quantity = obj.quantity
        if quantity == 0:
            return self.format_qnt(quantity, 'red')
        if quantity < obj.limited_number_of_items_threshold:
            return self.format_qnt(quantity, 'yellow')
        else:
            return quantity

    quantity_formated.short_description = 'Quantity'

    def get_category(self, obj):
        return obj.product.category

    get_category.short_description = 'Category'

    def get_default_image(self, obj):
        image_obj = obj.product_image.filter(is_default=True).get()

        return render_icon(image_obj, 'image')

    get_default_image.short_description = 'Image'


@admin.register(ProductDetail)
class ProductDetailsAdmin(admin.ModelAdmin):
    pass


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    pass


admin.site.register(Brand,)
