from django.urls import path
from .views import RatingCreateView

app_name = 'ratings'
urlpatterns = [
    path('create', RatingCreateView.as_view(), name='ratings_create')
]
