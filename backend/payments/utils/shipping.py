from operator import itemgetter


def get_dimensional_weight(volume, weight, dimensional_factor):
    """
    takes volume in cubic cm and weight in kg, dimensional factor -> dimensional_weight
    """
    try:
        dimensional_weight = volume / dimensional_factor
        return max(dimensional_weight, weight)
    except ZeroDivisionError:
        raise ValueError('dimensional factor cannot be zero')
    except TypeError:
        raise ValueError('Volume or weight have to be numbers')


def get_weight(is_dimensional, item_volume_and_weights, get_dimensional_weight=None, dimensional_factor=None):
    total_weight = 0
    for item in item_volume_and_weights:
        volume, weight = itemgetter('volume', 'weight')(item)
        if is_dimensional:
            dimensional_weight = get_dimensional_weight(volume, weight, dimensional_factor)
            total_weight += dimensional_weight
        else:
            total_weight += weight
    return total_weight
