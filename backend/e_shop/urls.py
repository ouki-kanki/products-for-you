from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


#
# admin and api endpoints are valid
# the rest of the endpoints was moved to the api app
#  users/ products/ cart/ orders/ are marked as obsolete
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),

    # these are obsolete
    # path('users/', include('user_control.urls')),
    path('products/', include('products.urls')),
    # path('cart/', include('shopping_cart.urls')),
    # path('orders/', include('order.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += [path('silk/', include('silk.urls', namespace='silk'))]
