from rest_framework.permissions import BasePermission
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        role = getattr(request.user, 'role', '').lower()
        return request.user.is_authenticated and role == 'admin'

class IsArtisan(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'artisan'

class IsClient(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'client'

class EmailBackend(ModelBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        UserModel = get_user_model()
        if email is None:
            email = kwargs.get(UserModel.USERNAME_FIELD)
        try:
            user = UserModel.objects.get(email=email)
        except UserModel.DoesNotExist:
            return None
        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None