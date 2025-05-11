import datetime

from django.conf import settings
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

from user_control.models import CustomUser


class MyTokenObtainSerializer(TokenObtainPairSerializer):  # pylint: disable=abstract-method
    def validate(self, attrs):
        data = super().validate(attrs)

        if not self.user.is_verified:
            raise serializers.ValidationError("Account is not activated.Please activate the account")
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['username'] = user.username
        token['uuid'] = str(user.uuid)

        del token['user_id']

        return token


DEMO_USER_ACCESS_TOKKEN_LIFETIME = settings.SIMPLE_JWT.get("ACCESS_TOKEN_DEMO_USER_LIFETIME")
DEMO_USER_REFRESH_TOKKEN_LIFETIME = settings.SIMPLE_JWT.get("REFRESH_TOKEN_DEMO_USER_LIFETIME")


class MyDemoTokenObtainSerializer(MyTokenObtainSerializer):  # pylint: disable=abstract-method

    # skip the check if the user is verified derived from the parent class
    def validate(self, attrs):
        data = TokenObtainPairSerializer.validate(self, attrs)

        # change lifetime for demo user tokens
        refresh_token = self.get_token(self.user)
        refresh_token.set_exp(lifetime=DEMO_USER_REFRESH_TOKKEN_LIFETIME)
        data['refresh'] = str(refresh_token)

        access_token = refresh_token.access_token
        access_token.set_exp(lifetime=DEMO_USER_ACCESS_TOKKEN_LIFETIME)

        data['access'] = str(access_token)

        return data


class RegistrationSerializer(serializers.ModelSerializer):

    password2 = serializers.CharField(style={"input_type": "password"}, write_only=True)
    username = serializers.CharField(required=False, default='')
    # if it is not rendering properly use source=get_role_display
    role = serializers.CharField(required=False, default='visitor')

    class Meta:
        model = CustomUser
        fields = (
            'email',
            'username',
            'password',
            'password2',
            'role',
        )

        extra_kwargs = {
            'password': {'write_only': True}
        }

    def save(self, **kwargs):
        user = CustomUser(
            email=self.validated_data['email'],
            role=self.validated_data['role'],
            username=self.validated_data['username']
        )
        password = self.validated_data['password']
        password2 = self.validated_data['password2']

        # validate special chars pass length etc
        special_characters = set('$%^&*()@#!~:"<>\'?/`')
        if not any(char in special_characters for char in password):
            raise serializers.ValidationError({'password': 'Password must contain at least one special character'})

        if len(password) < 8:
            raise serializers.ValidationError({'password': 'Password must be more that 8 characters'})

        if password != password2:
            raise serializers.ValidationError({'password': 'Passwords have to be the same'})

        user.set_password(password)
        user.save()

        return user
