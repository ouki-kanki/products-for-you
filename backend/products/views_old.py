from django.shortcuts import get_object_or_404 
from django.db.models import Prefetch, Q

from rest_framework import filters

from rest_framework import (
    generics, mixins, permissions, authentication, viewsets
)
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from common.util.custom_pagination import CustomPageNumberPagination
from .models import Product, ProductItem, Category, Brand
from .serializers_old import (
    CategorySerializer, CategoryRelatedProducts, ProductSerializer, ProductItemSerializer, ProductAndRelatedVariationsSerializer,
    ProductAndFeaturedVariationSerializer, ProductAndLastCreatedVariationSerializerV3,
    ProductSerializerV3,
    ProductVariationSerializerV3,
    ProductAndCategoriesSerializerV3,
    BrandSerializer,
    ProductSerializerV4,
    ProductItemSerializerV4,
    ProductItemDetailSerializerV4,
    ProductItemSearchSerializerV4
)


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.all().order_by('position', 'id')


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
        return super().list(request, *args, **kwargs)


product_and_featured_variation_view = ProductAndFeaturedVariationListView.as_view()


#  --- V3 ---- 
class ProductAndFeaturedVariationListViewV3(generics.ListAPIView):
    queryset = Product.objects.prefetch_related(
        Prefetch('product_variations', queryset=ProductItem.objects.filter(is_default=True) \
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





class LatestProductsListApiView(generics.ListAPIView):
    '''
        gets the 10 latest products
    '''
    queryset = Product.objects.order_by('-created_at').prefetch_related(
        Prefetch('product_variations', queryset=ProductItem.objects.filter(is_default=True) \
        .prefetch_related('product_image')
    ))
    serializer_class = ProductSerializerV3
    pagination_class = CustomPageNumberPagination


latest_products_view_with_page = LatestProductsListApiView.as_view()


# --- CORE ---
class LastestFeaturedVariationsListApiView(generics.ListAPIView):
    """
    get the latest featured variations with paginination
    endpoint: latest-variations
    gets the latest products with the featured variation for each product
    endpoint: products/latest-products
    TODO: fetch the brand
    """
    queryset = ProductItem.objects.select_related('product__category', 'product') \
                                  .filter(is_default=True) \
                                  .order_by('-created_at')

    serializer_class = ProductVariationSerializerV3
    pagination_class = CustomPageNumberPagination

    def get(self, request, *args, **kwargs):
        # print("the req", request)
        return super().get(request, *args, **kwargs)


latest_featured_variations_with_page = LastestFeaturedVariationsListApiView.as_view()


#  --- CORE ---- 
class FeaturedProductsListView(generics.ListAPIView):
    """
    returns the products that are flagged with "is_featured_product" & also have a variation that
    has is_featured = true
    """
    queryset = ProductItem.objects.select_related('product__category', 'product') \
                                  .filter(is_default=True, product__is_featured=True) \
                                  .order_by('-created_at')

    serializer_class = ProductVariationSerializerV3
    pagination_class = CustomPageNumberPagination


featured_products_view = FeaturedProductsListView.as_view()


class ProductsAndParentCategoriesListApiView(generics.ListAPIView):
    '''
    get products along with their parent categories
    '''
    queryset = Product.objects.select_related('category')
    serializer_class = ProductAndCategoriesSerializerV3


get_product_and_parent_categories_view = ProductsAndParentCategoriesListApiView.as_view()


class BrandListApiView(generics.ListAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer

get_brand_view = BrandListApiView.as_view()


# V4 
class ProductsAndRelatedVariationsView(generics.ListAPIView):
    """
    endpoint: latest_products-v4
    """
    serializer_class = ProductSerializerV4
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

    
products_and_related_variations_view = ProductsAndRelatedVariationsView.as_view()


class ProductDetailViewV4(generics.RetrieveAPIView):
    queryset = ProductItem.objects.all()
    serializer_class = ProductItemDetailSerializerV4
    lookup_field = 'slug'
    # lookup_url_kwarg = '' # TODO: maybe have to use in order to use the slug but make the query using the primary key ?


product_detail_view_v4 = ProductDetailViewV4.as_view()


class RelatedProductsView(generics.ListAPIView):
    """
    get the related products of the same category
    TODO: use prefetch and select to min the qyeries 
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializerV4
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        qs = super().get_queryset()
        product_id = self.kwargs['pk']
        product = Product.objects.get(id=product_id)
        qs = qs.filter(category=product.category).exclude(id=product_id)
        return qs


class ProductPreview(generics.RetrieveAPIView):
    """
    is used on the product cards when the user clicks the icon to change 
    variation for each product.
    """
    queryset = ProductItem.objects.all()
    serializer_class = ProductItemSerializerV4
    lookup_field = 'slug'


product_preview = ProductPreview.as_view()


class ProductSearchView(generics.ListAPIView):
    """
    search products based on the name and the description
    """
    serializer_class = ProductItemSearchSerializerV4
    queryset = ProductItem.objects.all()
    filter_backends = [filters.SearchFilter]
    # search_fields = ['product_id__name', 'detailed_description', 'product_id__description',]
    search_fields = ['detailed_description',]

    def get_queryset(self):
        query = self.request.query_params.get('search', '')
        print(query)
        return ProductItem.objects.filter(
            # Q(product_id__name__icontains=query) |
            # Q(product_id__category__icontains=query) |
            # Q(product_id__description__icontains=query) |
            Q(detailed_description__icontains=query)
          )


product_search_view = ProductSearchView.as_view()


class ProductItemFacetedSearch(generics.ListAPIView):
    """
    filter using variation name and values
    """
    serializer_class = ProductItemSerializerV4
    # queryset = ProductItem.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['variation_option__variation_id__name', 'variation_option__value']

    def get_queryset(self):
        variation_name = self.request.query_params.get('variation_name', None)
        variation_value = self.request.query_params.get('variation_value', None)

        print("yoyo", variation_name, variation_value)

        queryset = ProductItem.objects.filter(
            Q(variation_option__variation_id__name=variation_name) &
            Q(variation_option__value=variation_value)
        )

        return queryset


product_faceted_search_view = ProductItemFacetedSearch.as_view()


class ProductListByCategoryView(generics.ListAPIView):
    """
    filter products based on the category
    """
    serializer_class = ProductSerializerV4

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
    
products_list_by_category_view = ProductListByCategoryView.as_view()
