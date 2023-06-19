from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include('user_control.urls')),
    path('products/', include('products.urls'))
]
