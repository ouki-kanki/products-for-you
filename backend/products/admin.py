from django.contrib import admin
from django.contrib.admin.widgets import AdminFileWidget
from django.conf import settings
from django.db import models
from django.utils.html import format_html

from .models import Product, ProductItem, Category, Brand

from common.util.static_helpers import render_icon


# helpers
def render_link_with_image(value):
    return  f'''<a href="{value.url}" target="_blank">
                    <img 
                    src="{value.url}" alt="{value}" 
                    width="100" height="100"
                    style="object-fit: cover;"
                    />
                </a>'''    


class CustomAdminFileWidget(AdminFileWidget):
    '''
    customize the edit/create form of category to show thumbnail of the uploaded image
    '''
    def render(self, name, value, attrs=None, renderer=None):
        result = []

        if hasattr(value, "url"):
            result.append(
                render_link_with_image(value)
            )
        result.append(super().render(name, value, attrs, renderer))

        return format_html("".join(result))



@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('product_icon', 'name')
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
    list_display = ('product_icon', 'name', 'brand')

    formfield_overrides = {
    models.ImageField: { 'widget': CustomAdminFileWidget }
    }

    def product_icon(self, obj):
        return render_icon(obj)

admin.site.register((ProductItem, Brand),)