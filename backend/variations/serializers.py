from rest_framework import serializers

from .models import Variation, VariationOptions


class VariationOptionsSerializer(serializers.ModelSerializer):
    '''
    return a json with the name and the value of the variation
    '''
    variation_name = serializers.CharField(source='variation')
    class Meta:
        model = VariationOptions
        fields = ('variation_name', 'value')