from django.urls import path, include
from products.views import (
    CategoryListView, CategoryFeaturedListView,

)
from drf_spectacular.views import (
    SpectacularAPIView, SpectacularSwaggerSplitView, SpectacularSwaggerView
)


app_name = 'api'
urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='categories'),
    path('categories/featured', CategoryFeaturedListView.as_view(), name='categories'),

    # path('orders/create', OrderCreateView.as_view(), name='order-create'),
    path('orders/', include('order.urls')),

    path('products/', include('products.urls')),
    path('cart/', include('shopping_cart.urls')),
    path('payment/', include('payments.urls')),

    path('auth/', include('auth.urls')),
    path('user-control/', include('user_control.urls')),
    path('search/', include('search.urls')),

    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('schema/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
