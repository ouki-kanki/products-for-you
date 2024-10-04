from django.core.exceptions import ObjectDoesNotExist, EmptyResultSet
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.shortcuts import get_object_or_404

from rest_framework import viewsets, mixins, status, generics
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

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


class UserProfileView_(generics.GenericAPIView, mixins.RetrieveModelMixin):
    serializer_class = UserDetailSerializer
    permission_classes = [IsAuthenticated]
    queryset = UserDetail.objects.all()

    def retrieve(self, request, *args, **kwargs):
        uid = force_str(urlsafe_base64_decode(kwargs['uid']))
        print("the uid", uid)

        try:
            user_detail = UserDetail.objects.get(user=uid)
        except UserDetail.DoesNotExist:
            return Response({'error': 'no_user_profile'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print("exception inside retrieve", e)

        serializer = self.get_serializer(user_detail)
        return Response(serializer.data)


class UserProfileView_(generics.GenericAPIView, mixins.RetrieveModelMixin):
    """ returns data from the UserDetail table """
    serializer_class = UserDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'user'
    queryset = UserDetail.objects.all()

    def get(self, request, *args, **kwargs):
        try:
            return self.retrieve(request, args, kwargs)
        # TODO below exception catches nothing
        except (UserDetail.DoesNotExist, NotFound, ObjectDoesNotExist):
            print("does not exists")
            return Response({"message": 'no_user'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print("the exception", e)
            return Response({
                "message": 'no_user_detail',
            }, status=status.HTTP_404_NOT_FOUND)


class UserProfileView(generics.GenericAPIView, mixins.RetrieveModelMixin):
    serializer_class = UserDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        return get_object_or_404(UserDetail, user=user)

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)


