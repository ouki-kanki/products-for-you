from django.contrib import admin
from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'colored_status')
    inlines = [CartItemInline,]

    def colored_status(self, obj):
        return obj.colored_status

    colored_status.short_description = 'status'


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    pass
