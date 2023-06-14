from django.db import models
from user_control.models import CustomUser as User

Categories = (
    ("toys", "toys"),
    ("phone cases", "phone cases"),
    ("shoes", "shoes"),
    ("hard drives", "hard drives"),
    ("monitors", "monitors"),
    ("gpu", "gpu"),
    ("basketballs", "basketballs")
)



# TODO: should i put variations here or add a diff app?

class Category(models.Model):
    name = models.CharField(max_length=20, choices=Categories)
    parent_category = models.ForeignKey("self", on_delete=models.SET_DEFAULT, default="category not defined")
    icon = models.CharField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)




# TODO: TABLE FOR PRODUCT DETAILS, IMAGES


class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    # TODO: check if set null is the correct approach
    category = models.ForeignKey(Category, on_delete=models.SET_DEFAULT, default="category not defined")
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    # deleted_at = NOT IMPLEMENTED


# TODO: how can i join with variations
class ProductItem(models.Model):
    '''
    product table - item will have different price in relation with the different variations
    '''
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE)
    sku = models.CharField(max_length=255)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)



