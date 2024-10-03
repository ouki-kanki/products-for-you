from rest_framework import viewsets, mixins, status, generics
from rest_framework.permissions import IsAuthenticated

from .models import CustomUser as User, UserDetail
from .serializers import UserSerializer, UserDetailSerializer


class UsersViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.RetrieveModelMixin):
    """ User list & detail """
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_field = 'pk'


users_list_view = UsersViewSet.as_view({
    'get': 'list'
})

# TODO: this retrieves the user model , not the user detail 
# it will bring confusion, have to change the names 
users_detail_view = UsersViewSet.as_view({
    'get': 'retrieve'
})


class UserProfileView(generics.GenericAPIView, mixins.RetrieveModelMixin):
    """ returns data from the UserDetail table """
    serializer_class = UserDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'user'
    queryset = UserDetail.objects.all()

    def get(self, request, *args, **kwargs):
        print(request.session)
        return self.retrieve(request, args, kwargs)

