from rest_framework.response import Response
from rest_framework import status


def generic_exception(e):
    """
    give a generic message to the client
    """
    print(f"generic_exception_error: ", str(e))
    return Response({
        "message": "something went wrong"
    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
