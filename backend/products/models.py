from django.db import models
from user_control.models import CustomUser as User


# TODO: should i put variations here or add a diff app?
# NOTE: models.PROTECT it seems that does not allow null=True
class Category(models.Model):
    name = models.CharField(max_length=255)
    parent_category = models.ForeignKey("self", on_delete=models.SET_NULL, related_name='parent', blank=True, null=True)
    icon = models.CharField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    # TODO: maybe this field is usefull
    # is_parent = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name




# TODO: TABLE FOR PRODUCT DETAILS, IMAGES


class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class meta:
        verbose_name = "Product"


# TODO: how can i join with variations?
class ProductItem(models.Model):
    '''
    product table - item will have different price in relation with the different variations
    '''
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_variation')
    sku = models.CharField(max_length=255)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Product Variation"
        db_table_comment = "Variation of Product"



