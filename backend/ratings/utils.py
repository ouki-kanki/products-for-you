from django.shortcuts import get_object_or_404
from products.models import ProductItem


def resolve_product_from_product_item_uuid(uuid):
    """ given the uuid of the product_item return the instance of the product"""
    product_item = get_object_or_404(ProductItem.objects.select_related('product'), uuid=uuid)
    return product_item.product


def convert_rating_scale_to_five(num: int):
    """ given a number from 0 - 10 it return a number from 0 - 5 with step .5

    Args:
        num (int): the number in the scale 0 - 10

    Returns:
        num (int | float): return number in the scale of 0 - 5 with step .5
    """
    if not num:
        return None

    five_star_scale = num / 2
    return int(five_star_scale) if five_star_scale.is_integer() else five_star_scale
