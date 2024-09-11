from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Promotion
from .serializers import PromotionSerializer


class SinglePromotionView(APIView):
    """ fetch single promotion"""

    def get_object(self, slug): # noqa
        try:
            return Promotion.objects.get(slug=slug)
        except Promotion.DoesNotExist:
            raise Http404

    def get(self, request, slug=None):
        promotion = self.get_object(slug)
        serializer = PromotionSerializer(promotion)
        return Response(serializer.data)

