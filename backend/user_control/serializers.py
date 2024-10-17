from rest_framework import serializers
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import ValidationError

from .models import CustomUser, UserDetail
from common.validators.field_validators import is_numeric

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'username', 'role')


class TokenSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Token
        fields = ('key', 'user', 'role')


# NOT IMPLEMENTED
class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(style={"input_type": "password"}, required=True)
    new_password = serializers.CharField(style={"input_type": "password"}, required=True)

    def validate_current_password(self, value):
        if not self.context['request'].user.check_password(value):
            raise serializers.ValidationError({'current_password': 'Does not match'})
        return value
    

class UserDetailSerializer(serializers.ModelSerializer):
    email = serializers.SerializerMethodField()

    class Meta:
        model = UserDetail
        exclude = ('id', 'created_at', 'updated_at')

    def get_email(self, obj): # noqa
        if isinstance(obj, dict):
            return obj.get('email', None)
        return obj.email

    def validate(self, data):
        number_fields = ('phone_number', 'cell_phone_number')
        for field in number_fields:
            value = data.get(field, '')
            if value == '':
                continue
            is_numeric(value, field)
        return data

    def validate_image(self, value): # noqa
        if value and not value.content_type.startswith('image/'):
            raise ValidationError("file is not an image")
        return value

