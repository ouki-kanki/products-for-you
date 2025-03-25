from rest_framework import serializers
from .models import ShippingPlanOption


class ShippingPlanOptionSerializer(serializers.ModelSerializer):
    """
    NOTE: read only
    """
    estimated_delivery_time = serializers.SerializerMethodField()
    plan_name = serializers.CharField(source='plan.name', read_only=True)
    plan_option_id = serializers.UUIDField(source='uuid', read_only=True)
    company_name = serializers.CharField(source='plan.company.name', read_only=True)

    class Meta:
        model = ShippingPlanOption
        fields = [
            'plan_name',
            'plan_option_id',
            'company_name',
            'estimated_delivery_time'
        ]

    def get_estimated_delivery_time(self,obj): # noqa
        if obj.min_estimated_delivery_time and obj.max_estimated_delivery_time:
            min_days = obj.min_estimated_delivery_time.days
            max_days = obj.max_estimated_delivery_time.days

            if min_days == 1 and max_days == 1:
                return 'same day delivery'
            elif min_days == max_days:
                return f'delivery in {min_days} days'
            else:
                return f'{min_days} - {max_days} days delivery time'
        return None
