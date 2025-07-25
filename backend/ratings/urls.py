from django.urls import path
from .views import (
    RatingCreateView, RatingsGetAverageOveral, RatingsGetAllAspectsAverage,
    GetListOfRatings, ProductAspectsAPIView
)
app_name = 'ratings'
urlpatterns = [
    path('create', RatingCreateView.as_view(), name='ratings_create'),
    path('get-overall-ratings-avg', RatingsGetAverageOveral.as_view(), name='ratings_avg_overall'),
    path('get-ratings/<uuid:product_item_uuid>', GetListOfRatings.as_view(), name='list_of_ratings'),
    path('get-ratings-detail', RatingsGetAllAspectsAverage.as_view(), name='ratings_detail'),
    path('rating-aspects/<uuid:product_item_uuid>', ProductAspectsAPIView.as_view(), name='rating_aspects'),
]
