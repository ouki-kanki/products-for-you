from rest_framework import serializers
from rest_framework.authtoken.models import Token

from .models import CustomUser, UserDetail


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
        exclude = ('id', 'created_at', 'updated_at', 'user')

    def get_email(self, obj):
        return obj.email
