from collections.abc import MutableMapping


def _flatten_dict_gen(d, key_to_exlude):
    for k, v in d.items():
        new_key = k
        if isinstance(v, MutableMapping) and k != key_to_exlude:
            yield from flatten_dict(v, new_key).items()
        else:
            yield new_key, v


def flatten_dict(d: MutableMapping, key_to_exlude: str = ''):
    '''
    flattens a dictionary with nested dictionaries.
    if a key_to_exlude is defined it will ignore the current key and it will leave it nested
    '''
    return dict(_flatten_dict_gen(d, key_to_exlude))

