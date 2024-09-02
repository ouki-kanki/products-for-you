from django.shortcuts import get_object_or_404
from django.db.models import Q

from rest_framework.response import Response
from rest_framework import (
    generics, viewsets, mixins, permissions, authentication
)

from .models import Product, ProductItem, Category, ProductImage
from .serializers import (
    ProductSerializer, ProductVariationSerializer, ProductItemDetailSerializer,
    ProductItemSerializer, CategorySerializer, ProductImageSerializer
)
from common.util.custom_pagination import CustomPageNumberPagination


class ProductsAndRelatedVariationsView(generics.ListAPIView):
    """
    endpoint: api/products/latest/
    description: get products filter by created_at
    """
    serializer_class = ProductSerializer
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        category = self.request.query_params.get('category_id')
        queryset = Product.objects.select_related('brand', 'category') \
            .prefetch_related(
            'product_variations',
            'product_variations__variation_option',
            'product_variations__product_image'
        ).order_by('-created_at')

        if category:
            queryset = queryset.filter(category=category)

        return queryset


class GetDefaultVariationsView(generics.ListAPIView):
    """
    endpoint: /api/products/default
    description: get productItems filter by default
    """
    queryset = ProductItem.objects.select_related('product__category', 'product') \
        .filter(is_default=True) \
        .order_by('-created_at')

    serializer_class = ProductVariationSerializer
    pagination_class = CustomPageNumberPagination


class FeaturedProductsListView(generics.ListAPIView):
    """
    endpoint: /api/products/featured
    description: get productItems filter by is_default.gives the variation for each products
    that is flagged as default, sort creation_time
    """

    queryset = ProductItem.objects.select_related('product__category', 'product') \
        .filter(is_default=True, product__is_featured=True) \
        .order_by('-created_at')

    serializer_class = ProductVariationSerializer
    pagination_class = CustomPageNumberPagination


class ProductDetailViewV4(generics.RetrieveAPIView):
    queryset = ProductItem.objects.all()
    serializer_class = ProductItemDetailSerializer
    lookup_field = 'slug'


class ProductPreview(generics.RetrieveAPIView):
    """
    endpoint: /api/products/preview/<slug:slug>
    description: get the tumbnails of productVariation
    """
    queryset = ProductItem.objects.all()
    serializer_class = ProductItemSerializer
    lookup_field = 'slug'


class ProductListByCategoryView(generics.ListAPIView):
    """
    endpoint: /api/products/category/<int:id>
    description: get products filtered by category using the id
    """
    serializer_class = ProductSerializer

    def get_queryset(self):
        category_id = self.kwargs.get('category_id')
        category = get_object_or_404(Category, id=category_id)

        queryset = Product.objects.filter(category=category).prefetch_related(
            'product_variations',
            'product_variations__product_image'
        )

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)


class ProductListByCategoryBySlug(generics.ListAPIView):
    """ get products filter by category slug"""

    serializer_class = ProductSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        slug = self.kwargs.get('slug')
        category = get_object_or_404(Category, slug=slug)
        queryset = Product.objects.filter(category=category).prefetch_related(
            'product_variations',
            'product_variations__product_image'
        )

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)


class CategoryListView(generics.ListAPIView):
    """
    endpoint: /api/categories
    description: get all categories sort by position
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.all().order_by('position', 'id')


