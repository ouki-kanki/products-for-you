from rest_framework import serializers


def is_numeric(value, field):
    if not value.isdigit():
        raise serializers.ValidationError(f"the field {field} only accepts numbers")
