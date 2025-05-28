from rest_framework.permissions import BasePermission


class IsAuthButNotDemo(BasePermission):
    """ allows authenticated users but not the demo account"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role != "demo_user"
