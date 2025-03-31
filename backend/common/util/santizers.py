import json
from typing import Callable

from django.db.models import JSONField


class SanitizedJSONField(JSONField):
    '''
    -- from saleor --
    A json field that runs a given sanitization method before saving to the database
    '''
    # TODO: this is this to prevent xxs attacks ? check it
    # 
    # 

    def __init__(self, *args, sanitizer: Callable[[dict], dict], **kwargs):
        super(SanitizedJSONField, self).__init__(*args, **kwargs)
        self._sanitizer_method = sanitizer

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        kwargs["sanitizer"] = self._sanitizer_method
        return name, path, args, kwargs

    def get_db_prep_save(self, value: dict, connection):
        """Sanitize the value for saving using the passed sanitizer."""
        return json.dumps(self._sanitizer_method(value))


def strip_zero_decimals_from_str(value):
    """
    clear 0 decimals or return the value
    """
    return value.rstrip('0').rstrip('.') if '.' in value else value
