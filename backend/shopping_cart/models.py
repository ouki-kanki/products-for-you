from django.db import models
from django.utils.html import format_html

from user_control.models import CustomUser as User
from products.models import ProductItem
import uuid


class Cart(models.Model):
    class Status(models.TextChoices):
        ACTIVE = 'A', 'active'
        ABANDONED = 'AB', 'abandoned'
        ORDERED = 'O', 'ordered'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart')
    # session_id = models.UUIDField(default=uuid.uuid4)
    status = models.CharField(max_length=2, choices=Status.choices, default=Status.ACTIVE)
    locked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    @property
    def colored_status(self):
        if self.status == self.Status.ACTIVE:
            return format_html('<span style="color: mediumspringgreen">active</span>')
        if self.status == self.Status.ABANDONED:
            return format_html('<span style="color: tomato">abandoned</span>')
        if self.status == self.Status.ORDERED:
            return format_html('<span style="color: mediumaquamarine">ordered</span>')

    @property
    def num_of_items(self):
        items = self.cart_items.all()
        qty = sum([ qty.quantity for qty in items ])
        return qty

    @property
    def sub_total(self):
        cart_items = self.cart_items.all()

        if cart_items.exists():
            sub_total = sum([(item.price * item.quantity) for item in cart_items])
            return sub_total

    def __str__(self):
        return self.user.email


class CartItem(models.Model):
    cart_id = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='cart_items')
    product_item = models.ForeignKey(ProductItem, on_delete=models.CASCADE, related_name='cart_items')
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    modified_at = models.DateTimeField(auto_now=True)

    @property
    def sub_total(self):
        return self.quantity * self.price

    def __str__(self):
        return self.product_item.product_name



