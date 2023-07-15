from django.db import models

from products.models import Category


class Variation(models.Model):
    # TODO: why this is connected to category
    category_id = models.ForeignKey(Category, on_delete=models.SET_NULL, blank=True, null=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class VariationOptions(models.Model):
    variation_id = models.ForeignKey(Variation, on_delete=models.PROTECT)
    value = models.CharField(max_length=255)

    # TODO: need to add extra table related to this to give the ability to add extra attributes to each variation (for instance color code)

    @property
    def variation(self):
        return self.variation_id.name
    
    def __str__(self):
        return self.variation


