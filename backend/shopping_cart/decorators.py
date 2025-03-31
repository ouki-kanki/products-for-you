from functools import wraps

from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from .models import Cart


# *** NOT USED ***
# *** a mixin is used inside mixins***
def check_cart_lock(view_func):
    @wraps(view_func)
    def wrapped_view(request):
        user = request.user
        cart = get_object_or_404(Cart, user=user, status=Cart.Status.ACTIVE)
        if cart.locked:
            return Response({
                "message": 'cart is locked'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return view_func(request)
    return wrapped_view
