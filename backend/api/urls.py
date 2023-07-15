from django.urls import path, include

from rest_framework.routers import DefaultRouter

from drf_spectacular.views import (
    SpectacularAPIView, SpectacularSwaggerSplitView, SpectacularSwaggerView
)



# router = DefaultRouter()
# router.register(r'schema', SpectacularAPIView)
# router.register(r'schema/docs', SpectacularSwaggerView)

# app_name = 'api'
urlpatterns = [
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('schema/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]


