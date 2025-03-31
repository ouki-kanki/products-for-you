from django.contrib import admin
from django import forms
from django.utils.safestring import mark_safe
from .models import Location, Company, ShippingPlan, ShippingPlanOption, TaxRate


class TaxRateAdminForm(forms.ModelForm):
    class Meta:
        model = TaxRate
        fields = '__all__'
        widgets = {
            'rate': forms.NumberInput(attrs={'step': 0.1})
        }


@admin.register(TaxRate)
class TaxRateAdmin(admin.ModelAdmin):
    form = TaxRateAdminForm
    list_display = ('title', 'rate', 'formated_rate',)
    search_fields = ('rate',)
    list_editable = ('rate',)

    def formated_rate(self, obj): # noqa
        return f"{obj.rate}%"

    formated_rate.short_description = 'Rate (%)'


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    pass


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent', 'tax_rate')
    search_fields = ('name',)
    autocomplete_fields = ('tax_rate',)


@admin.register(ShippingPlan)
class ShippingPlanAdmin(admin.ModelAdmin):
    # TODO: show an inline
    pass


class ShippingPlanOptionAdminForm(forms.ModelForm):
    PREDEFINED_TITLES = [
        ('standard', 'Standard Shipping'),
        ('express', 'Express Shipping'),
        ('bulk', 'Bulk Shipping'),
    ]

    title = forms.ChoiceField(choices=PREDEFINED_TITLES + [('', 'Custom Title')], required=False)
    custom_title = forms.CharField(required=False, max_length=255)

    # volume calculator
    length = forms.DecimalField(required=False, label='Length', label_suffix='cm')
    height = forms.DecimalField(required=False, label='Height', label_suffix='cm')
    width = forms.DecimalField(required=False, label='Width', label_suffix='cm')
    volume = forms.CharField(required=False, label='volume', label_suffix='cm^3')
    volume_meters = forms.CharField(required=False, label='volume in cubic meters', label_suffix='m^3')

    class Media:
        js = ('js/shippingCost.js',)

    class Meta:
        model = ShippingPlanOption
        fields = '__all__'

    def clean(self):
        cleaned_data = super().clean()
        title = cleaned_data.get('title')
        custom_title = cleaned_data.get('custom_title')

        if not title and custom_title:
            raise forms.ValidationError("Please provide a title")

        if not custom_title:
            cleaned_data['title'] = dict(self.PREDEFINED_TITLES).get(title, title)
        else:
            cleaned_data['title'] = custom_title

        return cleaned_data


@admin.register(ShippingPlanOption)
class ShippingPlanOptionAdmin(admin.ModelAdmin):
    form = ShippingPlanOptionAdminForm
    list_display = ('plan', 'origin', 'destination', 'formated_threshold', 'uuid')

    fieldsets = (
        (None, {
            'fields': (
                'plan', 'origin', 'destination',
                'min_weight_threshold', 'max_weight_threshold',
                'min_estimated_delivery_time', 'max_estimated_delivery_time',
                'base_cost', 'extra_fee',)
        }),
        ('Volume Calculator', {
            'fields': ('length', 'height', 'width', 'volume', 'volume_meters'),
            'description': 'help to determine the threshold',
            'classes': ('collapse',)
        })
    )

    # readonly_fields = ('formated_threshold', 'formated_cost',)
    def formated_threshold(self, obj): # noqa
        return mark_safe(f"<span>{obj.min_weight_threshold}cm<sup>3</sup></span>")

    # def formated_cost(self, obj): # noqa
    #     return f"{obj.cost}€"

    formated_threshold.short_description = 'min threshold'

