from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

from user_control.models import Roles, CustomUser

class MyTokenObtainSerializer(TokenObtainPairSerializer): # noqa

    @classmethod
    def get_token(cls, user):
        print(type(user))
        print(user.email)
        token = super().get_token(user)
        token['email'] = user.email
        token['username'] = user.username

        return token


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

        if password != password2:
            raise serializers.ValidationError({'password': 'Passwords have to be the same'})

        user.set_password(password)
        user.save()

        return user
