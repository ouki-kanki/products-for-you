from django.apps import apps
from jsonschema import ValidationError


def get_list_of_parent_categories(category, init_list):
    '''
    returns list of categories in the form ['grand_parent', 'parent', 'child']
    '''
    if not category:
        return init_list[::-1]

    if isinstance(category, dict):
        init_list.append(category['name'])
        parent_category = category['parent_category']
    else:
        init_list.append(category.name)
        parent_category = category.parent_category

    if not parent_category:
        return init_list[::-1]

    return get_list_of_parent_categories(parent_category, init_list)


def representation_categories_to_list(repr_data):
    """
    take the prepr object, return categories & parent categories to list
    """
    category = repr_data['category']
    try:
        if not category:
            return []
        list_of_categories = get_list_of_parent_categories(category, [])
        repr_data['category'] = list_of_categories
    except Exception as e:
        return ValidationError(f"error serializing categories: {str(e)}")
    return repr_data


def add_favorite_product_to_ret(ret, request, instance):
    """
    if the user is authenticated show if the product is favorite in the returning json
    """
    user = request.user
    if user and user.is_authenticated:
        favorite_product_item = apps.get_model('products', 'FavoriteProductItem')
        is_favorite = favorite_product_item.objects.filter(user=user, product_item=instance).exists()
        ret['is_favorite'] = is_favorite
    return ret


