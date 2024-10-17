from .models import UserDetail
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import APIException

class CustomFilterMixin:
    def get_active_users(self):
        return self.queryset.filter(status='active')


class UserUpdateMixin:
    queryset = UserDetail.objects.all()
    def get_object(self):
        user = self.request.user.id
        return UserDetail.objects.get(user=user)

    def patch(self, request, *args, **kwargs):
        data = request.data.copy()
        data['user'] = request.user.id
        instance = self.get_object()
        serializer = self.get_serializer(instance, data, partial=True)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
        except ValueError as e:
            print("the error inside the view", e)
            return Response({'detail': e.args[0]}, status=status.HTTP_400_BAD_REQUEST)
        # if prefetch_related will be used clear cache
        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}
        # raise APIException("this is an error", code=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_200_OK)
