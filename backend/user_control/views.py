from django.db import IntegrityError
from django.shortcuts import get_object_or_404

from rest_framework import viewsets, mixins, status, generics, permissions
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import FormParser, MultiPartParser

from .models import CustomUser as User, UserDetail
from products.models import ProductItem, FavoriteProductItem
from .serializers import UserSerializer, UserDetailSerializer
from products.serializers import FavoriteProductItemSerializer, ProductItemSerializer
from .mixins import UserUpdateMixin


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

    # exclude the user
    # def get_serializer(self, *args, **kwargs):
    #     serializer_class = self.get_serializer_class()
    #     serializer_instance = serializer_class(*args, **kwargs)
    #     # serializer_instance.fields.pop('user')
    #     return serializer_instance

    def get_object(self):
        user = self.request.user.id
        return get_object_or_404(UserDetail, user=user)

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)


class UserProfileInsertView(generics.CreateAPIView):
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


class UserProfileUpdate(UserUpdateMixin, generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserDetailSerializer

    def perform_update(self, serializer):
        instance = serializer.save()
        print("the instance", instance)


class UploadProfileImageView(UserUpdateMixin, generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserDetailSerializer
    parser_classes = [MultiPartParser, FormParser]


class FavoriteProductItemListView(generics.ListAPIView):
    serializer_class = ProductItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = ProductItem.objects.filter(favorite_by__user=user)

        return qs


class FavoriteProductItemAddView(generics.CreateAPIView):
    serializer_class = FavoriteProductItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data['user'] = request.user.id

        slug = request.data.get('slug')

        try:
            product_item = ProductItem.objects.get(slug=slug)
            data['product_item'] = product_item.pk
        except ProductItem.DoesNotExist:
            return Response({
                "detail": "product not found"
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        try:
            serializer.save()
        except IntegrityError:
            raise ValidationError({
                'detail': "product is already in the favorites list"
            })


class FavoriteProductItemDeleteView(generics.DestroyAPIView):
    serializer_class = FavoriteProductItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        user = request.user
        slug = request.data.get('slug')
        try:
            favorite_product_item = FavoriteProductItem.objects.get(product_item__slug=slug, user=user)
            favorite_product_item.delete()
            return Response({
                "detail": "favorite item deleted"
            }, status=status.HTTP_204_NO_CONTENT)
        except FavoriteProductItem.DoesNotExist:
            return Response({
                'detail': "favorite product not found"
            }, status=status.HTTP_404_NOT_FOUND)

