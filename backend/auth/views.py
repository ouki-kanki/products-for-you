from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import MyTokenObtainSerializer


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainSerializer
