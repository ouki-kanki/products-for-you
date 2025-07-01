from django.shortcuts import get_object_or_404
from products.models import ProductItem


def resolve_product_from_product_item_uuid(uuid):
    """ given the uuid of the product_item return the instance of the product"""
    product_item = get_object_or_404(ProductItem.objects.select_related('product'), uuid=uuid)
    return product_item.product
