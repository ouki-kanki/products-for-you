from rest_framework import serializers

from .models import Variation, VariationOptions


class VariationOptionsSerializer(serializers.ModelSerializer):
    variation_name = serializers.CharField(source='variation')
    '''
    return a json with the name and the value of the variation
    '''
    class Meta:
        model = VariationOptions
        fields = ('variation_name', 'value')