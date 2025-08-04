from django.shortcuts import get_object_or_404
from django.db.models import Q, Prefetch
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework import (
    generics, viewsets, mixins, permissions, authentication, status
)

from promotion.models import ProductsOnPromotion
from common.util.custom_pagination import CustomPageNumberPagination

from .models import Product, ProductItem, Category, ProductImage
from .serializers import (
    ProductSerializer, ProductVariationSerializer, ProductItemDetailSerializer,
    ProductItemSerializer, ProductItemExtendedSerializer, CategorySerializer, ProductImageSerializer,
    ProductItemQuantitySerializer
)


class LatestProductsView(generics.ListAPIView):
    """
    endpoint: api/products/latest/
    description: get products sort by created_at
    filter by category using the category id
    """
    serializer_class = ProductSerializer
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        category = self.request.query_params.get('category_id')
        queryset = Product.objects.select_related('brand', 'category') \
            .prefetch_related(
            'product_variations__product_inventory',
            'product_variations__product_inventory__promotion_id',
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
    # TODO: this fetches the default variation, i want to be able to fetch featured variations
    # i want the first featured to be shown on the top of the landing page
    # TODO: prefetch related on featured_item
    queryset = ProductItem.objects.select_related('product__category', 'product') \
        .filter(is_default=True, product__is_featured=True,) \
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


# NOTE: this combines all the data that is needed for the landing page
# paginination is not working properly

class CategoryFeaturedListView(generics.ListAPIView):
    """
    endpoint: /api/categories/featured
    description: get the list of featured_categories
    """
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.filter(is_featured=True).order_by('-created_at')


class PromotedProductItemsListApiView(generics.ListAPIView):
    serializer_class = ProductItemExtendedSerializer

    def get_queryset(self):
        current_date = timezone.now().date()

        promotion_qs = ProductsOnPromotion.objects.filter(
            Q(promotion_id__date_override=True) |
            Q(
                promotion_id__promo_start__lte=current_date,
                promotion_id__promo_end__gte=current_date)

        ).prefetch_related('promotion_id')

        return ProductItem.objects.filter(
            product_inventory__in=promotion_qs
        ).prefetch_related(
            Prefetch('product_inventory', queryset=promotion_qs, to_attr='active_promotions')
        ).distinct()


class GetSimilarProductsView(generics.ListAPIView):
    serializer_class = ProductVariationSerializer

    def get_queryset(self):
        slug = self.request.query_params.get('slug')
        category = self.request.query_params.get('category')
        brand = self.request.query_params.get('brand')

        if not category:
            return ProductItem.objects.none()

        qs = ProductItem.objects.select_related('product__category', 'product')\
            .filter(product__category__name=category)

        if slug:
            product = Product.objects.prefetch_related('product_variations')\
                .get(product_variations__slug=slug)
            qs = qs.exclude(product=product)\
                .order_by('?')[:4]
        return qs

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        if not queryset.exists():
            return Response({
                'message': 'similar products not found',
            }, status=status.HTTP_204_NO_CONTENT)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ProductQuantitiesForCartView(generics.ListAPIView):
    """
    take the qnts of the products so that the user cannot add more than the available qnts to the cart
    """
    serializer_class = ProductItemQuantitySerializer
    throttle_classes = [ScopedRateThrottle,]
    throttle_scope = 'cart_limit'

    def post(self, request): # noqa
        items_uuid_list = request.data.get('uuid_list', [])

        if not items_uuid_list:
            return Response({
                "message": 'ids are not valid'
            }, status=status.HTTP_400_BAD_REQUEST)

        items = ProductItem.objects.filter(uuid__in=items_uuid_list)
        if not items.exists():
            return Response({
                'message': 'matching items for cart not found'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        serializer = self.get_serializer(items, many=True)

        return Response({
            'items': serializer.data
        }, status=status.HTTP_200_OK)


# *** THIS IS NOT USED ***
class LandingPageView(APIView):
    def get(self, request, *args, **kwargs): # noqa
        paginator = CustomPageNumberPagination()

        featured_products = ProductItem.objects.select_related('product__category', 'product') \
            .filter(is_default=True, product__is_featured=True) \
            .order_by('-created_at')
        paginated_featured_products = paginator.paginate_queryset(featured_products, request)
        featured_products_serializer = ProductVariationSerializer(paginated_featured_products, many=True)

        latest_products = Product.objects.select_related('brand', 'category') \
            .prefetch_related(
            'product_variations',
            'product_variations__variation_option',
            'product_variations__product_image'
        ).order_by('-created_at')
        paginated_latest_products = paginator.paginate_queryset(latest_products, request)
        print("the paginated latest", paginated_latest_products)
        latest_products_serializer = ProductSerializer(paginated_latest_products, many=True, context={'request': request})

        featured_categories = Category.objects.filter(is_featured=True)
        featured_categories_serializer = CategorySerializer(featured_categories, many=True)

        return paginator.get_paginated_response({
            'featured_products': featured_products_serializer.data,
            'latest_products': latest_products_serializer.data,
            'featured_categories': featured_categories_serializer.data
        })


