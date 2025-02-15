from django.utils.text import slugify

import random
import string


def lower_random(number_of_letters):
    '''
    return a random sequence of letters of a desired number
    '''
    return "".join(random.choice(string.ascii_lowercase) for _ in range(number_of_letters)) 



def slugify_unique(sender, instance, source: str) -> str:
    """
    takes the model, the instance and the source (eg: instance.name) that will be used for slug,
    if the slug exists it will append a random hash to end of slug
    ** changes the slug field of the instance. this method returns void
    sender: Model class
    instance: the current instance
    source: the text that it will be used for slug
    """
    slug = slugify(source)
    qs = sender.objects.filter(slug=slug).exclude(id=instance.id)

    if qs.exists():
        slug = f'{slug}-{lower_random(4)}-{lower_random(4)}'

    return slug
