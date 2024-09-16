from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

from .serializers import MyTokenObtainSerializer


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


