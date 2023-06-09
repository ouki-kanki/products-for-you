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


class RegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={"input_type": "password"}, write_only=True)

    class Meta:
        model = User
        # TODO remove the role and set default role 
        # ROLE MUST BE SET FROM SUPERUSER ONLY!!
        fields = ('email', 'password', 'password2', 'role')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def save(self):
        user = User(email=self.validated_data['email'],)
        password = self.validated_data['password']
        password2 = self.validated_data["password2"]

        if password != password2:
            raise serializers.ValidationError({'password': 'Passwords are not the same.'})
        
        user.set_password(password)
        user.save()

        return user
        

# NOT IMPLEMENTED
class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(style={"input_type": "password"}, required=True)
    new_password = serializers.CharField(style={"input_type": "password"}, required=True)

    def validate_current_password(self, value):
        if not self.context['request'].user.check_password(value):
            raise serializers.ValidationError({'current_password': 'Does not match'})
        return value