from django.db import models
from django.contrib import messages

from products.models import ProductItem
from common.enums import CountryCode, CityCode


class ShippingZone(models.Model):
    pass


class Store(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    zip_code = models.CharField(max_length=20)
    city = models.CharField(max_length=4, choices=CityCode.choices, default=CityCode.ATHENS)
    country = models.CharField(max_length=4, choices=CountryCode.choices, default=CountryCode.GREECE)
    is_default = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.address}"


class StoreDetails(models.Model):
    store = models.OneToOneField(Store, on_delete=models.CASCADE, related_name='store_details')
    phone_number = models.CharField(max_length=100)
    mobile_number = models.CharField(max_length=100)
    email = models.EmailField()


# TODO: for multistore -- not implemented for now --
class Stock(models.Model):
    product_item = models.ForeignKey(ProductItem, on_delete=models.CASCADE, related_name='stock')
    store = models.ForeignKey(Store, on_delete=models.SET_NULL, related_name='stock', null=True, blank=True)
    quantity = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.product_item.sku} - {self.store.name}: {self.quantity}"
