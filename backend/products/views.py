from django.shortcuts import get_object_or_404 

from rest_framework import (
    generics, mixins, permissions, authentication, viewsets
)
from rest_framework.response import Response

from .models import Product, ProductItem, Category
from .serializers import (
    CategorySerializer, CategoryRelatedProducts, ProductSerializer, ProductItemSerializer, ProductAndRelatedVariationsSerializer 
)

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

category_list_view = CategoryListView.as_view()


class CategoryDetail(generics.RetrieveAPIView):
    '''
        detail of product category using slug
        endpoint: /products/categories/<slug>
    '''
    queryset = Category.objects.all()
    # TODO: show the related products
    # for now it just gives the category
    serializer_class = CategoryRelatedProducts
    lookup_field = 'slug'

category_detail_related_products_view = CategoryDetail.as_view()

class CategoryOldListView(viewsets.ViewSet):
    '''
    viewset to show the categories
    '''

    # NOTE: qs are lazy so there is no problem at all declaring the qs as class variable
    queryset = Category.objects.all()

    def list(self, request):
        serializer = CategorySerializer(self.queryset, many=True)
        return Response(serializer.data)
    
    # Not implemented
    def retrieve(self, request, pk=None):
        category = get_object_or_404(self.queryset, pk=pk)
        serializer = CategorySerializer(category)

        return Response(serializer.datta)


# category_list_view = CategoryListView.as_view({'get': 'list'})

class ProductListAPIView(generics.ListAPIView):
    '''
        list the products
        endpoint: /products/
    '''
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


product_list_view = ProductListAPIView.as_view()


class ProductDetailAndRelatedVariations(generics.RetrieveAPIView):
    '''
    detail of the product alongside the related variations
    endpoint: /products/<slug>
    '''
    queryset = Product.objects.all()
    serializer_class = ProductAndRelatedVariationsSerializer
    lookup_field = 'slug'



product_detail_related_variations_view = ProductDetailAndRelatedVariations.as_view()   


class ProductItemListView(generics.ListAPIView):
    # TODO: list the variations related to a product, maybe have to change, it will give performance issues 
    '''
        lists all the variations
    '''
    queryset = ProductItem.objects.all()
    serializer_class = ProductItemSerializer

product_item_list_view = ProductItemListView.as_view()


class ProductItemDetailView(generics.RetrieveAPIView):
    '''
        detail of product variations using slug
        endpoint: /products/product-items/<slug>
    '''
    queryset = ProductItem.objects.all()
    serializer_class = ProductItemSerializer
    lookup_field = 'slug'

product_item_detail_view = ProductItemDetailView.as_view()



class ProductLatestListView(generics.ListAPIView):
    queryset = ProductItem.objects.all()[0:10]
    serializer_class = ProductItemSerializer

product_latest_view = ProductLatestListView.as_view()