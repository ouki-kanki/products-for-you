from collections import OrderedDict

def get_list_of_parent_categories(category, init_list):
    '''
    returns list of categories in the form parent > parent > child
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


