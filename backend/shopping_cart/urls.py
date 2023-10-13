from django.urls import path


from .views import add_to_cart

# 
# endpoint: cart/
# 

urlpatterns = [
    # path('', ),
    path('add', add_to_cart, name='add_to_cart')
]
