from django.utils.text import slugify

import random
import string


def __lower_random(number_of_letters):
    '''
    return a random sequence of letters of a desired number
    '''
    return "".join(random.choice(string.ascii_lowercase) for _ in range(number_of_letters)) 


def slugify_unique(sender, instance, source):
    '''
    takes the class, the instance and the source that will be used for slug, if the slug exists it will append a random hash to end of slug
    '''
    slug = slugify(source)
    qs = sender.objects.filter(slug=slug).exclude(id=instance.id)

    if qs.exists():
        slug = f'{slug}-{__lower_random(4)}-{__lower_random(4)}'

    instance.slug = slug
