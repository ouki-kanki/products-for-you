from django.db import models
from django.db.models.signals import pre_save
from django.utils import timezone

from shopping_cart.models import CartItem
from products.models import ProductItem

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
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='order', blank=True, null=True)
    ref_code = models.CharField(blank=True)
    order_date = models.DateTimeField(editable=False)
    modified = models.DateTimeField(blank=True)

    # NOT IMPLEMENTED !!
    # user_payment = models.ForeignKey('USEr_PAYMENT', on_delete=models.CASCADE, related_name='order_payment')
    # NOT IMPLEMENTED !!
    phoneNumber = models.CharField(max_length=255)
    shipping_address = models.CharField(max_length=255)
    billing_address = models.CharField(max_length=255)
    order_status = models.ForeignKey(OrderStatus, on_delete=models.PROTECT, default=1)
    # TODO: maybe this has to be a property
    order_total = models.DecimalField(max_digits=6, decimal_places=2)

    class RefundChoices(models.TextChoices):
        NOT_REQUESTED = 'fl', 'False'
        REQUESTED = 'rq', 'requested'
        COMPLETED = 'cmpl', 'completed'

    refund_status = models.CharField(
        choices=RefundChoices.choices,
        default=RefundChoices.NOT_REQUESTED
    )

    def user_email(self):
        if self.user_id:
            email = self.user_id.email
            return email if email else 'not provided'
        return 'no user provided'

    def user_name(self):
        if self.user_id:
            user_name = self.user_id.username 
            return user_name if user_name else 'Not provided'

        return 'not provided'
    
    @property
    def order_date_formated(self):
        return self.order_date.strftime("%d-%m-%Y -- %H:%M:%S")
    
    @property
    def date_modified_formated(self):
        return self.modified.strftime("%Y-%m-%d%H:%M:%S") if self.modified else 'no modification detected'

    # -- not implemented
    def calculate_final_price(self):
        if self.ref_code:
            pass
        pass


def shop_order_pre_save(sender, instance, *args, **kwargs):
    if not instance.id:
        instance.order_date = timezone.now()
    instance.modified = timezone.now()

pre_save.connect(shop_order_pre_save, sender=ShopOrder)


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
