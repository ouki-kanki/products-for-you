from rest_framework import generics, mixins, permissions, authentication

from .models import Product, ProductItem, Category
from .serializers import ProductItemSerializer


class ProductListAPIView(generics.ListAPIView):
    '''
        list the products
    '''
    queryset = ProductItem.objects.all()
    serializer_class = ProductItemSerializer



product_list_view = ProductListAPIView.as_view()


