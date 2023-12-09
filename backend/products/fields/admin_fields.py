import json
from typing import Any
from django import forms


class FeaturesField(forms.Field):
    widget = forms.Textarea

    # used to make validation of the data
    def to_python(self, value: Any | None) -> Any | None:
        if not value:
            return []
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return [item.strip() for item in value.split(',')]

    def prepare_value(self, value: Any) -> Any:
        if isinstance(value, list):
            return ', '.join(value)
        return value
