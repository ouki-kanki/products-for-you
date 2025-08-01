import binascii
from jsonschema import ValidationError
from decouple import config

from django.db.utils import IntegrityError
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.shortcuts import render

from rest_framework import viewsets
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.tokens import AccessToken

from e_shop.throttling.resend_email import ResendEmailThrottle
from user_control.serializers import UserSerializer
from user_control.models import CustomUser as User
from mixins.verify_captcha_mixin import RecaptchaVerifyMixin
from exceptions.custom_exceptions import ActivationEmailError

from .serializers import (
    MyTokenObtainSerializer, MyDemoTokenObtainSerializer,
    RegistrationSerializer, TokenRefreshSerializerForNormalAndDemoUsers)
from .auth_utils import send_activation_email


class MyTokenObtainPairView(RecaptchaVerifyMixin, TokenObtainPairView):
    """ login -> get a pair of access and refresh tokens """
    serializer_class = MyTokenObtainSerializer

    def post(self, request, *args, **kwargs):
        recaptcha_error_response = self.verify_captcha_or_error_response(request, action='login')

        if recaptcha_error_response:
            return recaptcha_error_response

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


# TODO: demo-user
# mark the demo user as active
class DemoTokenObtainPairView(RecaptchaVerifyMixin, APIView):
    """ logins a demo account

    Args:
        reCaptchaToken: recaptcha token from client
    """
    # create a demo user
    def post(self, request, *args, **kwargs):
        recaptcha_error_response = self.verify_captcha_or_error_response(request, action='login')

        if recaptcha_error_response:
            return recaptcha_error_response

        try:
            demo_user, created = User.objects.get_or_create(
                username='demo_user',
                email='demo_user@demouser.com',
                is_verified=True,
                is_active=True,
                role='demo_user'
            )

            demo_user.set_password(config('DEMO_PASS'))
            demo_user.save()
        except IntegrityError:
            return Response({
                "message": 'could not create the demo user'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except ValidationError as e:
            return Response({
                "message": f'could not create the demo user: {e.args[0]}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        data = {
            "username": demo_user.username,
            "email": demo_user.email,
            "password": config('DEMO_PASS')
        }

        serializer = MyDemoTokenObtainSerializer(data=data)
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        jwt_data = serializer.validated_data
        response = Response(jwt_data, status=status.HTTP_200_OK)

        # response.delete_cookie("refresh")
        response.set_cookie(
            key='refresh',
            value=jwt_data['refresh'],
            httponly=True,
            secure=False,
            samesite='Lax'
        )

        return response


# TOOD: if it is a demo account i have to procide the refresh for demo account
# i want the client to use the same view for normal and refresh users
class MyRefreshTokenObtainView(TokenRefreshView):
    """ send a new access & refresh token """
    serializer_class = TokenRefreshSerializerForNormalAndDemoUsers

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh')
        serializer = self.serializer_class(data={'refresh': refresh_token})

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        # TODO: remove refresh from response.it is set to cookie
        new_refresh_token = serializer.validated_data['refresh']
        response = Response(serializer.validated_data, status=status.HTTP_200_OK)

        response.set_cookie(
            key='refresh',
            value=new_refresh_token,
            httponly=True,
            secure=False,
            samesite='Lax',
            path='/'
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

        # TODO: if email cannot be send the user will get an error that something went wrong but the registration /
        # is completed if the gredentials are valid and user is not aware of the error.
        if serializer.is_valid():
            user = serializer.save()
            response_data = serializer.data
            response_data['uid'] = urlsafe_base64_encode(force_bytes(user.pk))

            try:
                send_activation_email(request, user)
            except ActivationEmailError as e:
                return Response({
                    "message": str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResendEmailView(APIView):
    throttle_classes = [ResendEmailThrottle]

    def get(self, request, *args, **kwargs): # noqa
        uidb64 = kwargs.get('user_id')
        uid = force_str(urlsafe_base64_decode(uidb64))

        # check if the user exists and send an email
        user = User.objects.get(pk=uid)

        if not user:
            return Response({
                "message": 'user not found'
            }, status=status.HTTP_400_BAD_REQUEST)

        if user.is_verified:
            return Response({
                "message": 'user is allready verified'
            }, status=status.HTTP_400_BAD_REQUEST)

        # try:
        #     send_activation_email(request, user)
        # except ActivationEmailError as e:
        #     return Response({
        #         "message": str(e)
        #     }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            "message": 'email was send',
        }, status=status.HTTP_200_OK)


class ActivateUserView(APIView):
    """
    extract the user_id and activate the user
    """
    def get(self, request, *args, **kwargs): # noqa
        token_str = request.query_params.get("token")
        if not token_str:
            return Response({
                "message": 'token is missing cannot activate'
            }, status=status.HTTP_400_BAD_REQUEST)
        try:
            token = AccessToken(token_str)
        except (TokenError, InvalidToken):
            return Response({
                "message": 'invalid or expired token'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            uidb64 = token.get("user_id")
            uid = force_str(urlsafe_base64_decode(uidb64))
        except (binascii.Error, UnicodeDecodeError):
            return Response({
                "message": "Invalid base64-econded user-id"
            }, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({
                "message": "User ID could not be decoded"
            }, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(pk=uid)
            user.is_verified = True
            user.save()
        except User.DoesNotExist:
            return Response({
                "message": "user does not exist, could not activate"
            }, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "message": 'user activated'
        }, status=status.HTTP_200_OK)


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
