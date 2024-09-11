from django.contrib import admin
from .models import Promotion, Coupon, PromoType, ProductsOnPromotion
from django_extensions.admin import ForeignKeyAutocompleteAdmin


class SelectPromotedProductAdmin(ForeignKeyAutocompleteAdmin):
    list_select_related = ('slug',)


class ProductOnPromotion(admin.StackedInline):
    """ access link table between product_item and promotion"""
    model = ProductsOnPromotion
    extra = 4
    raw_id_fields = ("product_item_id",)  # improves performance


@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    model = Promotion
    list_display = ('name', 'is_active', 'promo_start', 'promo_end')
    inlines = (ProductOnPromotion,)


admin.site.register(Coupon)
admin.site.register(PromoType)
