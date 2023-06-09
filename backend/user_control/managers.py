from django.db import models
from django.contrib.auth.models import UserManager



class CustomUserManager(UserManager):
    def _create_user(self, email, password, **kwargs):
        if not email:
            raise ValueError("Email is not provided")
        
        email = self.normalize_email(email)
        user = self.model(email=email, **kwargs)
        user.set_password(password)
        user.save(using=self._db)

        return user
    
    def create_user(self, email=None, password=None, **kwargs):
        kwargs.setdefault('is_staff', False)
        kwargs.setdefault('is_superuser', False)

        return self._create_user(email, password, **kwargs)
    
    def create_superuser(self, email=None, password=None, **kwargs):
        kwargs.setdefault('is_staff', True)
        kwargs.setdefault('is_superuser', True)

        return self._create_user(email, password, **kwargs)


class SoftDeleteManager(models.Manager):
    
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=True)


