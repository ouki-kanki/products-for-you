from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


print("yoyoyo", settings.MEDIA_ROOT)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('users/', include('user_control.urls')),
    path('products/', include('products.urls')),
    path('cart/', include('shopping_cart.urls')),    
]

if settings.DEBUG:
    print("iinside url static config")
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += [path('silk/', include('silk.urls', namespace='silk'))]