from django.db import models
from products.models import Category


class Variation(models.Model):
    # TODO: connect to a new table (product type) in relation to type can have certain group of variations
    category_id = models.ForeignKey(Category, on_delete=models.SET_NULL, blank=True, null=True)
    name = models.CharField(max_length=255)

    class Meta:
        verbose_name = "Variation"
        verbose_name_plural = "1 Variations"

    @property
    def related_category(self):
        return self.category_id.name

    def __str__(self):
        return self.name


class VariationOptions(models.Model):
    variation_id = models.ForeignKey(Variation, on_delete=models.PROTECT, related_name='variation_values')
    value = models.CharField(max_length=255)
    is_default = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Variation Values"
        verbose_name_plural = "2. Variation Values"

    @property
    def variation(self):
        """ returns the name of the variation (for instance "color") """
        return self.variation_id.name
    
    def __str__(self):
        return self.value


class VariationOptionalField(models.Model):
    variation_option_id = models.ForeignKey(VariationOptions, on_delete=models.CASCADE, related_name='variation_extra_parameters')
    name = models.CharField(max_length=255)
    value = models.CharField(max_length=255)

    
    class Meta:
        verbose_name = "Variation Extra Parameters"
        verbose_name_plural = "3. Variation extra Parameters"

    @property
    def parent_value(self):
        return self.variation_option_id.value
    
    def __str__(self):
        return self.parent_value
    

class Product(models.Model):
    name = models.CharField()

class ProductItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_variatons')


