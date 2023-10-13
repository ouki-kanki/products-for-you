from rest_framework import status, generics
from rest_framework.response import Response

import json

# TODO: convert to class


def add_to_cart(request):
    '''
    endpoint: cart/add

    has to accept a json of with the id of the product
    {
        id: product_id
    }

    '''
    data = json.loads(request.body)
    product_id = data["id"]

    content = {
        'everything is fine'
    }

    return Response(content, status=status.HTTP_200_OK)


class AddToCartAPIView(generics.CreateAPIView):
    pass