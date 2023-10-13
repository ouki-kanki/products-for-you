from django.db import models

from user_control.models import CustomUser as User
from products.models import ProductItem

import uuid


class Cart(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart')
    session_id = models.UUIDField(default=uuid.uuid4)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    # when the user completes the payment
    completed = models.BooleanField(default=False)

    @property
    def num_of_items(self):
        items = self.cart_items.all()
        qty = sum([ qty.quantity for qty in items ])
        return qty
    
    def __str__(self):
        return self.session_id


class CartItem(models.Model):
    '''
        these are the items for each cart
    '''
    card_id = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='cart_items')
    product_item = models.ForeignKey(ProductItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        # TODO: this returns the name from the grandparent. check it for efficiency & if there is a better alternative
        return self.product_item.product_name



