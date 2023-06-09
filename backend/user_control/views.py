from rest_framework import viewsets, mixins, status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from .models import CustomUser as User
from .serializers import UserSerializer, RegistrationSerializer


# LOGIN
class CustomAuthToken(ObtainAuthToken):
    '''
        customize the response 
    '''
    throttle_classes = [AnonRateThrottle]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})

        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'created': created,
            'user_id': user.pk,
            'email': user.email
        })
    

custom_auth_token = CustomAuthToken.as_view()

# TODO: give feedback to the user regarding the validity of email or password
# REGISTER
class RegistrationView(APIView):
    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

registration_view = RegistrationView.as_view()

class UsersViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.RetrieveModelMixin):
    '''
    User list & detail 
    '''
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_field = 'pk'


users_list_view = UsersViewSet.as_view({
    'get': 'list'
})

users_detail_view = UsersViewSet.as_view({
    'get': 'retrieve'
})

