from urllib.parse import urlparse

from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str, DjangoUnicodeDecodeError
from django.shortcuts import render

from rest_framework import viewsets
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework.views import APIView

import requests

from .serializers import MyTokenObtainSerializer, RegistrationSerializer
from user_control.serializers import UserSerializer
from user_control.models import CustomUser as User
from .auth_utils import send_activation_email


class MyTokenObtainPairView(TokenObtainPairView):
    """ login -> get a pair of access and refresh tokens """
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


class RegistrationView(APIView):
    """ register the user and send an activation email, redirects the user to the activation page """
    def post(self, request): # noqa
        serializer = RegistrationSerializer(data=request.data)

        # TODO: if email cannot be send the user will get an error that something went wrong but the registration
        # is completed if the gredentials are valid and user is not aware of that.
        if serializer.is_valid():
            user = serializer.save()
            response_data = serializer.data
            response_data['uid'] = urlsafe_base64_encode(force_bytes(user.pk))

            send_activation_email(request, user)

            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResendEmailView(APIView):
    def get(self, request, *args, **kwargs): # noqa
        uidb64 = kwargs.get('user_id')
        uid = force_str(urlsafe_base64_decode(uidb64))
        print("the user id", uid)

        # check if the user exists and send an email
        user = User.objects.get(pk=uid)
        print("the user email", user.email)

        if not user:
            return Response({
                "message": 'server error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # send email
        send_activation_email(request, user)

        return Response({
            "message": 'email was send',
        }, status=status.HTTP_200_OK)


class ActivateUserView(APIView):
    """
    activate the user and
    send signal to the client to redirect the user
    to login page
    """
    def get(self, request, *args, **kwargs): # noqa
        uidb64 = kwargs.get('token')
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            print("the user id", uid)
            user = User.objects.get(pk=uid)
            print("the user", user)

            # TODO if user is not found raise error
            user.is_verified = True
            user.save()

        except Exception as e:
            user = None
            return Response({'message': 'could not activate'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        host = request.get_host()
        domain = urlparse(f'//{host}').hostname
        print("domain", domain)

        try:
            response = requests.post(
                f'http://{domain}:8765/activate_user',
                timeout=5
            )
            response.raise_for_status()
            return Response(response.json(), status=status.HTTP_200_OK)
        except requests.exceptions.RequestException as e:
            print("server error", e)
            return Response({'message': 'service is not available'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)


@api_view(['GET'])
def view_activation_template(request):
    """ view the template that will send to email """
    current_site = get_current_site(request)
    user = {
        'username': 'Clown'
    }

    return render(request, 'authentication/activate_email.html', {
        "user": user,
        "domain": current_site,
        'uid': 3,
        "token": 'sdlfjsd34r'
    })


class NotificationTestViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(methods=['post'], detail=True)
    def activate_user(self, request, pk):
        user = self.get_object()
        print("the user inside the action", user)
