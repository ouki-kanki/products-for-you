from rest_framework import viewsets, mixins
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

from .models import CustomUser as User
from .serializers import UserSerializer


class CustomAuthToken(ObtainAuthToken):
    '''
        customize the response 
    '''

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



class UsersViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.RetrieveModelMixin):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_field = 'pk'


users_list_view = UsersViewSet.as_view({
    'get': 'list'
})

users_detail_view = UsersViewSet.as_view({
    'get': 'retrieve'
})

