from django.db import models
from django.core.exceptions import ValidationError


class TaxRate(models.Model):
    title = models.CharField(max_length=80, blank=True)
    rate = models.DecimalField(max_digits=4, decimal_places=2, help_text='percentage')

    def __str__(self):
        return f"{self.title} - f{self.rate}%"


class Location(models.Model):
    name = models.CharField(max_length=255)
    abbreviation = models.CharField(
        max_length=10,
        unique=True,
        help_text="abbreviation like (e.g., ATH for Athens)"
    )
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='sub_location')
    tax_rate = models.ForeignKey(TaxRate, on_delete=models.PROTECT, related_name='location', null=True, blank=True)
    is_country = models.BooleanField(default=False, help_text='is used for the client to fetch the list of available countries')

    def __str__(self):
        return self.name


class Company(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


PRICING_STRATEGY_CHOICES = (
    ('W', 'Weight'),
    ('D', 'Dimensional Weight')
)


class ShippingPlan(models.Model):
    company = models.ForeignKey(Company, on_delete=models.PROTECT, related_name='plan')
    name = models.CharField(max_length=255, help_text="standard express etc")
    pricing_strategy = models.CharField(
        max_length=1,
        choices=PRICING_STRATEGY_CHOICES,
        help_text="charging strategy"
    )
    dimensional_factor = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    cost_per_kg = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.company.name} - {self.name}"


class ShippingPlanOption(models.Model):
    plan = models.ForeignKey(ShippingPlan, on_delete=models.CASCADE, related_name='shipping_option')
    origin = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='origin')
    destination = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='destination')
    min_weight_threshold = models.DecimalField(
        max_digits=12,
        decimal_places=4,
        null=True,
        blank=True,
        help_text='inclusive')
    max_weight_threshold = models.DecimalField(
        max_digits=12,
        decimal_places=4,
        null=True,
        blank=True,
        help_text='exclusive')
    volume_threshold = models.DecimalField(max_digits=8, decimal_places=4, help_text='cubic meters upper limit', null=True)
    base_cost = models.DecimalField(max_digits=10, decimal_places=2)
    min_estimated_delivery_time = models.DurationField(null=True, blank=True, help_text='format [dd] [HH:MM:SS]')
    max_estimated_delivery_time = models.DurationField(null=True, blank=True, help_text='format [dd] [HH:MM:SS]')
    extra_fee = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def clean(self):
        super().clean()
        if self.min_estimated_delivery_time and self.max_estimated_delivery_time:
            # i want them to be same if the delivery is the same day
            if self.min_estimated_delivery_time > self.max_estimated_delivery_time:
                raise ValidationError({
                    'min_estimated_delivery_time': 'min estimated deliver time cannot be more that max'
                })

    def __str__(self):
        return f"{self.plan.name} - {self.origin} -> {self.destination}"




