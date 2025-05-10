import logging
from django.db import IntegrityError
from django.shortcuts import get_object_or_404
from django.core.exceptions import FieldError

from rest_framework import viewsets, mixins, status, generics, permissions
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import FormParser, MultiPartParser

from common.util.custom_pagination import CustomPageNumberPagination
from products.models import ProductItem, FavoriteProductItem
from products.serializers import FavoriteProductItemSerializer, ProductItemExtendedSerializer
from order.serializers import ShopOrderSerializerForClient
from order.models import ShopOrder

from .models import CustomUser as User, UserDetail
from .serializers import UserSerializer, UserDetailSerializer
from .mixins import UserUpdateMixin


logger = logging.getLogger(__name__)


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
        serializer.save()


class UploadProfileImageView(UserUpdateMixin, generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserDetailSerializer
    parser_classes = [MultiPartParser, FormParser]


class FavoriteProductItemListView(generics.ListAPIView):
    serializer_class = ProductItemExtendedSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        user = self.request.user

        print("the user inside favorites", user)
        qs = ProductItem.objects.filter(favorite_by__user=user)
        sort_by = self.request.query_params.get('sort_by')

        sort_values = {
            'name': 'product__name',
            '-name': '-product__name',
            'time': 'created_at',
            '-time': '-created_at'
        }

        if sort_by:
            try:
                qs = qs.order_by(sort_values.get(sort_by))
            except FieldError as e:
                logger.error('cannot sort orders: %e', e)
                print("cannot sort the orders")

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


class OrdersListApiView(generics.ListAPIView):
    serializer_class = ShopOrderSerializerForClient
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        user = self.request.user
        qs = ShopOrder.objects.filter(user_id=user).order_by('-created_at')
        sort_by = self.request.query_params.get('sort_by')

        if sort_by:
            try:
                qs = qs.order_by(sort_by)
            except FieldError as e:
                logger.error('cannot retrieve list of orders: %e', e)

                return Response({
                    "message": 'could not retrieve list of orders'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return qs
