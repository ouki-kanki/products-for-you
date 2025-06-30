from webbrowser import get
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ratings.models import (
    Rating, RatingAspect, RatingScore, AdminResponse
)
from user_control.models import CustomUser as User
from products.models import Product, ProductItem
from .serializers import RatingSerializer


class RatingCreateView(APIView):
    """
        view to create a product overal rating or create ratings for several rating aspects (in that case the avg rating of all aspcects will override the overall rating).
        optional: add a comment to the rating
    Args:
        APIView (_type_): _description_
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_item_uuid = request.data.get('product_item_uuid')
        user = request.user

        if (not user.is_authenticated):
            return Response({
                "message": 'user is not logged_in',
            }, status=status.HTTP_400_BAD_REQUEST)

        if (not product_item_uuid):
            return Response({
                "message": 'product_id was not provided'
            }, status=status.HTTP_400_BAD_REQUEST)

        product_item = get_object_or_404(ProductItem.objects.select_related('product'), uuid = product_item_uuid)
        product = product_item.product

        if Rating.objects.filter(user=user, product=product).exists():
            return Response({
                "message": "rating is allready submited for the currect product"
            }, status=status.HTTP_400_BAD_REQUEST)


        serializer = RatingSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            rating = serializer.save()
            print("the rating", rating)
            return Response({
                "message": 'rating_created'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RatingUpdateView(APIView):
    pass


class RatingDeleteView(APIView):
    pass


class RatingProductGetOveral(APIView):
    """
        get the overal rating to user for product preview cards
    """
    pass



