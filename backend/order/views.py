from django.shortcuts import render
from rest_framework import generics, permissions

from .models import ShopOrder
from .serializers import ShopOrderSerializer


class OrderCreateView(generics.CreateAPIView):
    queryset = ShopOrder.objects.all()
    serializer_class = ShopOrderSerializer
    permission_classes = [permissions.IsAuthenticated]


order_create_view = OrderCreateView.as_view()
