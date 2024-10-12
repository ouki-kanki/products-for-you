from django.shortcuts import get_object_or_404
from django.db import transaction

from rest_framework import viewsets, mixins, status, generics
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import FormParser, MultiPartParser

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
    serializer_class = UserDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user.id
        return get_object_or_404(UserDetail, user=user)

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)


class UserProfileInsertView_(generics.CreateAPIView):
    serializer_class = UserDetailSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data['user'] = request.user.id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class UserProfileInsertView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        data['user'] = request.user.id

        serializer = UserDetailSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UserProfileUpdate(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserDetailSerializer

    # def get_queryset(self):
    #     user = self.request.user.id
    #     return UserDetail.objects.get(user=user)

    def get_object(self):
        user = self.request.user.id
        return UserDetail.objects.get(user=user)

    def patch(self, request, *args, **kwargs):
        data = request.data.copy()
        data['user'] = request.user.id
        instance = self.get_object()
        serializer = self.get_serializer(instance, data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # if prefetch_related will be used clear the cache
        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data, status=status.HTTP_200_OK)

