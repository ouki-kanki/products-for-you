def get_list_of_parent_categories(category, list_of_categories):
    '''
    returns list of categories in the form parent > parent > child
    '''
    list_of_categories.append(category['name'])
    if not category['parent_category']:
        return list_of_categories[::-1]
    return get_list_of_parent_categories(category['parent_category'], list_of_categories)