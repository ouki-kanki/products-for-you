from rest_framework import serializers
from rest_framework.authtoken.models import Token

from .models import CustomUser as User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'role')


class TokenSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Token
        fields = ('key', 'user', 'role')

    