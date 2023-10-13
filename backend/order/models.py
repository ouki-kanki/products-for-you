from django.db import models
from django.db.models.signals import pre_save
from django.utils import timezone



from user_control.models import CustomUser as User


REFUND_CHOICES = [
    ('false', 'False'),
    ('request', 'request'),
    ('granded', 'granded')
]


class OrderStatus(models.Model):
    class Status(models.TextChoices):
        PROSSESING = 'PROSSESING', 'Prossesing'
        COMPLETED = 'COMPLETED', 'Completed'

    status = models.CharField(
        choices = Status.choices,
        default = Status.PROSSESING
    )

# Create your models here.
class ShopOrder(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='order')
    ref_code = models.CharField(blank=True)
    order_date = models.DateTimeField(editable=False)
    modified = models.DateTimeField()
    # NOT IMPLEMENTED !!
    user_payment = models.ForeignKey('USEr_PAYMENT', on_delete=models.CASCADE, related_name='order_payment')
    # NOT IMPLEMENTED !!
    shipping_address = models.ForeignKey('Shipping_Address', on_delete=models.CASCADE, related_name='shipping_order')
    billing_address = models.ForeignKey('shipping_adress', on_delete=models.SET_NULL, related_name='billing_address')
    order_status = models.ForeignKey(OrderStatus, on_delete=models.PROTECT)
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