from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from ratings.models import (
    Rating, RatingAspect, RatingScore, AdminResponse
)
from user_control.models import CustomUser as User


class RatingCreateView(APIView):
    """
        view to create a product overal rating or create ratings for several rating aspects.
        optional: add a comment to the rating
    Args:
        APIView (_type_): _description_
    """
    def post(self, request):
        user_id = getattr(request.user, 'id', None)
        product_uuid = request.data.get('product_uuid')
        print("reuqest -data", request.data)

        print("the user", user_id)

        if (not request.user.is_authenticated):
            return Response({
                "message": 'user is not logged_in',
            }, status=status.HTTP_400_BAD_REQUEST)

        if (not product_uuid):
            return Response({
                "message": 'product_id was not provided'
            }, status=status.HTTP_400_BAD_REQUEST)


        return Response({
            "message": 'rating_created'
        }, status=status.HTTP_201_CREATED)

        # get the user_id from the uuid provided


        # serialize_data = {
        #     "user": "user_id", ->
        # }




class RatingUpdateView(APIView):
    pass


class RatingDeleteView(APIView):
    pass


class RatingProductGetOveral(APIView):
    """
        get the overal rating to user for product preview cards
    """
    pass



