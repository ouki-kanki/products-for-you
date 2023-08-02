from django.db import models

from user_control.models import CustomUser as User
from products.models import ProductItem


class Cart(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart')
    session_id = models.CharField(max_length=255)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    completed = models.BooleanField(default=False)

    @property
    def num_of_items(self):
        items = self.cart_items.all()
        qty = sum([ qty.quantity for qty in items ])
        return qty


class CartItem(models.Model):
    card_id = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='cart_items')
    product_item = models.ForeignKey(ProductItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)



