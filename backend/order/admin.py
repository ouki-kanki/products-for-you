from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import ShopOrder, ShopOrderitem, OrderStatus


class ShopOrderItemInline(admin.TabularInline):  # or admin.StackedInline for a different layout
    model = ShopOrderitem
    extra = 0
    # fields = ('product_sku', 'quantity', 'price',)
    readonly_fields = ('variation_name', 'product_sku', 'quantity', 'price')

    def product_name(self, instance):
        return instance.product_name
    
    def variation_name(self, instance):
        return instance.variation_name

    def product_sku(self, instance):
        return instance.product_sku
    

@admin.register(OrderStatus)
class OrderStatusAdmin(admin.ModelAdmin):
    list_display = ('status',)

@admin.register(ShopOrder)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('user_email', 'order_date_formated', 'order_status_colored', 'user_name',)
    inlines = [ShopOrderItemInline]

    def order_date_formated(self, obj):
        return obj.order_date_formated

    order_date_formated.short_description = 'order-date'

    def order_status_colored(self, obj):

        order_status_lower = str(obj.order_status).lower()
        color_map = {
            'prossesing': 'yellow',
            'completed': 'green'
        }
        # 
        color = color_map.get(order_status_lower, 'white')

        return mark_safe(f'<span style="color: {color};">{obj.order_status}</span>')

    
    order_status_colored.short_description = 'order status'


admin.site.register(ShopOrderitem,)