from django.contrib import admin
from .models import Product, ProductItem, Category

# Register your models here.
admin.site.register((Product, ProductItem, Category),)