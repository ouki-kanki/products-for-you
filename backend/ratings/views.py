from django.db.models import Avg, Prefetch
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ratings.models import Rating, RatingAspect, RatingScore, Comment, AdminResponse
from .serializers import RatingSerializer, RatingSerializerReadOnly
from .utils import resolve_product_from_product_item_uuid


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
        # get the nick of the user

        if (not product_item_uuid):
            return Response({
                "message": 'product_id was not provided'
            }, status=status.HTTP_400_BAD_REQUEST)

        product = resolve_product_from_product_item_uuid(product_item_uuid)

        # TODO: keys are unique together, maybe this is not needed
        # handle the error from the model manager
        if Rating.objects.filter(user=user, product=product).exists():
            return Response({
                "message": "rating is allready submited for the currect product"
            }, status=status.HTTP_400_BAD_REQUEST)

        serializer = RatingSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            rating = serializer.save()
            return Response({
                "message": 'rating_created'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RatingUpdateView(APIView):
    pass


class RatingDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        product_item_uuid = request.data.get('product_item_uuid')
        product = resolve_product_from_product_item_uuid(product_item_uuid)

        rating = Rating.objects.filter(user=user, product=product).first()
        if not rating:
            return Response({
                "message": 'rating not found for the current product'
            }, status=status.HTTP_404_NOT_FOUND)

        rating.delete()
        return Response({
            "message": "rating deleted"
        }, status=status.HTTP_204_NO_CONTENT)


class RatingsGetAverageOveral(APIView):
    """
        gets the average 'overal' rating score for a specific product

        Query Parameters:
            uuid (str): The UUID of the product

        Returns:
            {
                "product": string (product_name),
                "rating_verall_avg: int
            }
    """
    def get(self, request):
        product_item_uuid = request.query_params.get('uuid')
        product = resolve_product_from_product_item_uuid(product_item_uuid)

        total_average = RatingScore.objects.filter(
            rating__product=product,
            aspect__name='overall'
        ).aggregate(average_score=Avg('score'))['average_score']

        if not total_average:
            return Response({
                "message": 'no reviews for the current product'
            }, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "product": product.name,
            "rating_overall_avg": total_average
        })


class RatingsGetAllAspectsAverage(APIView):
    """
        Query Parameterers:
            uuid (str): the uuid of the product
    """
    """TODO: if a user does not provide score for the rating aspcects but only
        the overall rating, then during the calculation of each aspect current's user
        rating is not involved in the calculation. if there 2 ratings and one has quality 10 and the other user only provides the overall then the avg quality for the product it will remain 10.
        i should not allow te user to only give an overall rating ?
        in the case that there are ratings that have aspects and ratings that have only the overall aspect then the avg overall will not match the avg of the aspects
      """

    def get(self, request):
        product_item_uuid = request.query_params.get('uuid')
        product = resolve_product_from_product_item_uuid(product_item_uuid)

        number_of_ratings = Rating.objects.filter(product=product).count()

        # NOTE: "Group all RatingScore records for this product by their aspect__name, and then compute the average score per group."
        aspects_list = RatingScore.objects.filter(
            rating__product=product
        ).values(
            'aspect__name'
        ).annotate(
            average=Avg('score')
        )

        print("the aspects list", aspects_list)

        normalized_aspect_list = [{"aspect": row["aspect__name"], "average": row["average"]} for row in aspects_list]

        # remove the overall average from the list of aspects
        overall_average = None
        for i, item in enumerate(normalized_aspect_list):
            if item['aspect'] == 'overall':
                overall_average_dict = normalized_aspect_list.pop(i)
                overall_average = overall_average_dict['average']
                break

        return Response({
            "num_of_ratings": number_of_ratings,
            "overall": overall_average,
            "aspects_average": normalized_aspect_list
        }, status=status.HTTP_200_OK)


class GetListOfRatings(APIView):
    """get the list of ratings for the current product

    Args:
        uuid: the productd uuid
    """
    def get(self, request):
        product_item_uuid = request.query_params.get('uuid')
        product = resolve_product_from_product_item_uuid(product_item_uuid)

        ratings = Rating.objects.filter(product=product) \
            .select_related('user', 'product') \
            .prefetch_related(
                Prefetch(
                    'scores',
                    queryset=RatingScore.objects.select_related('aspect')
                ),
                Prefetch(
                    'comments',
                    queryset=Comment.objects.select_related('user').prefetch_related(
                            Prefetch('response', queryset=AdminResponse.objects.select_related('responder'))
                        )
                )
            )

        if not ratings.exists():
            return Response({
                'message': 'No ratings available for this product'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer_data = RatingSerializerReadOnly(ratings, many=True).data

        return Response({
            'ratings': serializer_data,
        },status=status.HTTP_200_OK
        )
