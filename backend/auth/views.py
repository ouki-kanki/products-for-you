from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework.views import APIView

from .serializers import MyTokenObtainSerializer, RegistrationSerializer


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainSerializer

    # def get_queryset(self):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        refresh_token = response.data['refresh']
        response.set_cookie(
            key='refresh',
            value=refresh_token,
            httponly=True,
            secure=False,
            samesite='Lax',
        )

        return response


class MyRefreshTokenObtainView(TokenRefreshView):
    """ send a new access & refresh token """
    serializer_class = TokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh')
        serializer = self.serializer_class(data={'refresh': refresh_token})

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        new_refresh_token = serializer.validated_data['refresh']
        response = Response(serializer.validated_data, status=status.HTTP_200_OK)
        response.set_cookie(
            key='refresh',
            value=new_refresh_token,
            httponly=True,
            secure=False,
            samesite='Lax',
        )

        return response


class LogOutView(APIView):
    def post(self, request, *args, **kwargs): # noqa
        """ logout the user, clear the cookie """
        message = {
            'message': 'user logged out successfully'
        }

        response = Response(message, status=status.HTTP_200_OK)
        response.delete_cookie('refresh')

        return response


# TODO: give feedback to the user regarding the validity of email or password
class RegistrationView(APIView):
    def post(self, request): # noqa
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

