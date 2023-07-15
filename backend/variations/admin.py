from django.contrib import admin

from .models import Variation, VariationOptions

# Register your models here.
admin.site.register((Variation, VariationOptions),)