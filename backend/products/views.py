from django.shortcuts import get_object_or_404 
from django.db.models import Prefetch

from rest_framework import (
    generics, mixins, permissions, authentication, viewsets
)
from rest_framework.response import Response

from .models import Product, ProductItem, Category
from .serializers import (
    CategorySerializer, CategoryRelatedProducts, ProductSerializer, ProductItemSerializer, ProductAndRelatedVariationsSerializer,
    ProductAndFeaturedVariationSerializer, ProductAndLastCreatedVariationSerializerV3,
    ProductSerializerV3
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


class ProductListAndFeaturedVariationAPIView(generics.ListAPIView):
    '''
        list the products and for each product if there is a featured
        variation show the featured variation otherwise so the latest variation
    '''


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

class ProductAndFeaturedVariationListViewOld(generics.ListAPIView):
    '''
    it will return each product with the first featured variation
    or if there is no featured the last imported variation
    '''
    queryset = Product.objects.all()
    serializer_class = ProductAndFeaturedVariationSerializer

    # @override
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        data = []
        for product in serializer.data:
            featured_variation = self.get_featured_variation(product['id'])
            if featured_variation:
                product['featured_variation'] = ProductItemSerializer(featured_variation).data
            data.append(product)
        return Response(data)

    # return the featured item or the last created for each product
    def get_featured_variation(self, product_id):
        variations = ProductItem.objects.filter(product_id=product_id, is_featured=True)

        if variations.exists():
            return variations.first()
        else:
            return ProductItem.objects.filter(product_id=product_id).order_by('-created_at').first()
        

# product_and_featured_variation_view = ProductAndFeaturedVariationListViewOld.as_view()

# tackle the N + 1 problem
class ProductAndFeaturedVariationListView(generics.ListAPIView):
    queryset = Product.objects.prefetch_related('product_variations')
    serializer_class = ProductSerializer

    def list(self, request, *args, **kwargs):
        print('insdie the list')
        return super().list(request, *args, **kwargs)


product_and_featured_variation_view = ProductAndFeaturedVariationListView.as_view()


#  --- V3 ---- 
class ProductAndFeaturedVariationListViewV3(generics.ListAPIView):
    # queryset = Product.objects.prefetch_related('product_variations')
    queryset = Product.objects.prefetch_related(
        Prefetch('product_variations', queryset=ProductItem.objects.filter(is_featured=True) \
                 .prefetch_related('product_image')
                 )
    )

    serializer_class = ProductSerializerV3
    

product_and_featured_variation_view_V3 = ProductAndFeaturedVariationListViewV3.as_view()


class ProductAndLastCreatedVariationsListViewV3(generics.ListAPIView):
    # queryset = Product.objects.prefetch_related(
        # Prefetch('product_variations', queryset=ProductItem.objects.order_by('-created_at')[:1])
    # )
    queryset = Product.objects.prefetch_related(
        Prefetch('product_variations' , queryset=ProductItem.objects.all().prefetch_related('product_image'))
    )

    serializer_class = ProductAndLastCreatedVariationSerializerV3


product_and_last_created_variations_view_V3 = ProductAndLastCreatedVariationsListViewV3.as_view()