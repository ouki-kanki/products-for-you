from django.shortcuts import render
from rest_framework import generics 

from .models import ShopOrder
from .serializers import ShopOrderSerializer

class OrderCreateView(generics.CreateAPIView):
    queryset = ShopOrder.objects.all()
    serializer_class = ShopOrderSerializer

    

order_create_view = OrderCreateView.as_view()