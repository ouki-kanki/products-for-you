from math import ceil
from decimal import Decimal

from django.db import models, transaction
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.utils.translation import gettext_lazy as _

from common.util.slugify_helper import slugify_unique
from products.models import ProductItem


class PromoType(models.Model):
    """ type of the promotion """
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Coupon(models.Model):
    """ discount coupon """
    name = models.CharField(max_length=255)
    coupon_code = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class ProductsOnPromotion(models.Model):
    """
    link table between inventoryProduct and Promotion
    price override: to override the calculated price and apply a custom one
    """
    product_item_id = models.ForeignKey(ProductItem, on_delete=models.CASCADE, related_name='product_inventory')
    promotion_id = models.ForeignKey("Promotion", on_delete=models.CASCADE, related_name='promotion')
    promo_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00"),
        validators=[MinValueValidator(Decimal(0.00))]
    )
    price_override = models.BooleanField(default=False)

    class Meta:
        unique_together = ("product_item_id", "promotion_id")

    def save(self, *args, **kwargs):
        """ calculate promo_price """
        product_item_price = self.product_item_id.price
        promo_reduction = self.promotion_id.promo_reduction
        price_override = self.price_override

        if not price_override:
            promo_price = ceil(product_item_price - (product_item_price *
                                                     Decimal(promo_reduction / 100)))
            self.promo_price = promo_price
        return super(ProductsOnPromotion, self).save()


class Promotion(models.Model):

    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=50, blank=True, default='')
    description = models.TextField()
    promo_reduction = models.IntegerField(default=0)
    is_active = models.BooleanField(default=False)
    is_scheduled = models.BooleanField(default=False)
    promo_start = models.DateField()
    promo_end = models.DateField()

    coupon = models.ForeignKey(Coupon, on_delete=models.PROTECT, related_name='promotion')
    promo_type = models.ForeignKey(PromoType, on_delete=models.PROTECT, related_name='promotion')

    products_on_promotion = models.ManyToManyField(
        ProductItem,
        through=ProductsOnPromotion,
        related_name="products_on_promotion")

    def clean(self):
        if self.promo_start > self.promo_end:
            raise ValidationError(_("End date has to be after Start date"))

    def save(self, *args, **kwargs):
        if not self.id and not self.slug:
            slugify_unique(Promotion, self, self.name)

        super(Promotion, self).save(*args, **kwargs)

        # when promo_reduction changes calculate the promo_price
        products_on_promotion = self.products_on_promotion.through.objects.filter(promotion_id=self.id)
        for product_on_promotion in products_on_promotion:
            product_on_promotion.save()

    def __str__(self):
        return self.name
