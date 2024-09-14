from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class MyTokenObtainSerializer(TokenObtainPairSerializer): # noqa

    @classmethod
    def get_token(cls, user):
        print(type(user))
        print(user.email)
        token = super().get_token(user)
        token['email'] = user.email
        token['username'] = user.username

        return token
