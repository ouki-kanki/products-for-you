from collections import OrderedDict


def get_list_of_parent_categories(category, init_list):
    '''
    returns list of categories in the form ['grand_parent', 'parent', 'child']
    '''

    if isinstance(category, OrderedDict):
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
    list_of_catogories = get_list_of_parent_categories(category, [])
    repr_data['category'] = list_of_catogories
    return repr_data
