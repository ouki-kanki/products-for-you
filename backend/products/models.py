from django.db import models
from user_control.models import CustomUser as User

Categories = (
    ("toys", "toys"),
    ("phone cases", "phone cases"),
    ("shoes", "shoes"),
    ("hard drives", "hard drives"),
    ("monitors", "monitors"),
    ("gpu", "gpu")
)


class Category(models.Model):
    name = models.CharField(max_length=20, choices=Categories)




# TODO: TABLE FOR PRODUCT DETAILS, IMAGES


class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL)
    price = models.DecimalField()
    user = models.ForeignKey(User, on_delete=models.SET_NULL)
    sku = models.CharField(max_length=255, blank=True, default='')
    # inventory = models.ForeignKey() NOT IMPLEMENTED
    # discount = models.ForeignKey() NOT IMPLEMENTED
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    # deleted_at = NOT IMPLEMENTED



