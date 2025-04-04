from django.db import models
from django.db.models.signals import pre_save
from django.utils import timezone

from shopping_cart.models import CartItem, Cart
from products.models import ProductItem
from payments.models import ShippingPlanOption


from user_control.models import CustomUser as User


REFUND_CHOICES = [
    ('false', 'False'),
    ('request', 'request'),
    ('granded', 'granded')
]


class OrderStatus(models.Model):
    class Status(models.TextChoices):
        PLACED = 'PLACED', 'Placed'
        PROSSESING = 'PROSSESING', 'Prossesing'
        COMPLETED = 'COMPLETED', 'Completed'

    status = models.CharField(
        choices = Status.choices,
        default = Status.PLACED
    )

    def __str__(self):
        return self.status


# Create your models here.
class ShopOrder(models.Model):
    class ShippingMethod(models.TextChoices):
        PICK_UP = 'P', 'pick-up'
        DELIVERY = 'D', 'delivery'

    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='order', blank=True, null=True)
    ref_code = models.CharField(blank=True)
    phoneNumber = models.CharField(max_length=255)
    shipping_address = models.CharField(max_length=255)
    user_email = models.EmailField()
    billing_address = models.CharField(max_length=255)
    extra_shipping_details = models.TextField(blank=True)
    order_status = models.ForeignKey(OrderStatus, on_delete=models.PROTECT, default=1)
    order_total = models.DecimalField(max_digits=6, decimal_places=2)
    stripe_payment_id = models.CharField(max_length=255, blank=True, default='')
    cart = models.ForeignKey(Cart, on_delete=models.PROTECT, blank=True, null=True)
    session_cart = models.JSONField(blank=True, null=True)
    shipping_plan = models.ForeignKey(ShippingPlanOption, on_delete=models.PROTECT, related_name='orders', null=True, blank=True)
    shipping_method = models.CharField(max_length=1, choices=ShippingMethod.choices, default=ShippingMethod.DELIVERY)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class RefundChoices(models.TextChoices):
        NOT_REQUESTED = 'fl', 'False'
        REQUESTED = 'rq', 'requested'
        COMPLETED = 'cmpl', 'completed'

    refund_status = models.CharField(
        choices=RefundChoices.choices,
        default=RefundChoices.NOT_REQUESTED
    )

    def user_name(self):
        if self.user_id:
            user_name = self.user_id.username 
            return user_name if user_name else 'Not provided'

        return 'not provided'
    
    @property
    def order_date_formated(self):
        return self.created_at.strftime("%d-%m-%Y -- %H:%M:%S")
    
    @property
    def date_modified_formated(self):
        return self.updated_at.strftime("%Y-%m-%d%H:%M:%S") if self.modified else 'no modification detected'

    def __str__(self):
        return self.shipping_address


class ShopOrderitem(models.Model):
    order = models.ForeignKey(ShopOrder, on_delete=models.CASCADE, related_name='order_item')
    product_item = models.ForeignKey(ProductItem, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=6, decimal_places=2)

    @property
    def product_name(self):
        product_name = self.product_item.product_name

        return product_name if product_name else 'not provided'

    @property
    def product_sku(self):
        sku = self.product_item.sku
        return sku if sku else 'not provided'
    
    @property
    def variation_name(self):
        variation = self.product_item.variation_name
        return variation if variation else 'not provided'

    def __str__(self):
        return self.product_item.product_name
