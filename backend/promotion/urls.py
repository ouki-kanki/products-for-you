from django.urls import path
from .views import SinglePromotionView


app_name = 'promotion'
urlpatterns = [
    path('<slug:slug>', SinglePromotionView.as_view(), name='single_promotion'),
]
