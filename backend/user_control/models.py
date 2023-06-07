from django.db import models
from django.contrib.auth.models import (
    UserManager,
    AbstractBaseUser,
    PermissionsMixin
)
from django.db.models.query import QuerySet

from datetime import timezone

Roles = (
    ("admin", "admin"),
    ("assistant", "assistant"),
    ("editor", "editor"),
    ("sales_person", "sales_person"),
    ("customer", "customer"),
    ("visitor", "visitor")
)


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


class SoftDeleteModel(models.Model):
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(blank=True, null=True)
    deleted_objects = SoftDeleteManager()

    def soft_delete(self):
        self.deleted_at = timezone.now()
        self.is_deleted = True
        self.save()

    def restore(self):
        self.is_deleted = False
        self.save()

    class Meta:
        abstract = True


# NOTE: maybe splti to dif table?
class UserDetail(models.Model):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    address_one = models.CharField(max_length=255, blank=True, null=True)
    address_two = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    country = models.CharField(max_length=255, blank=True, null=True)


    def __str__(self):
        return f"{self.first_name} - {self.last_name}"


    
class CustomUser(AbstractBaseUser, SoftDeleteModel, PermissionsMixin):
    email = models.EmailField(blank=True, default='', unique=True)
    username = models.CharField(max_length=255, blank=True, null=True, default='')
    user_detail = models.OneToOneField(UserDetail, on_delete=models.SET_NULL, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    role = models.CharField(max_length=20, choices=Roles)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(blank=True, null=True)

    objects = CustomUserManager() # override the default UserManager

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = []


    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        db_table = 'User'
        db_table_comment = "custom user table"
        ordering = ('created_at',)

    def __str__(self):
        return self.email


    

# class CustomUserManager(BaseUserManager):

#   def create_superuser(self, email, password, **kwargs):
#     kwargs.setdefault('is_staff', True)
#     kwargs.setdefault('is_superuser', True)
#     kwargs.setdefault('is_active', True)

#     if kwargs.get("is_staff") is not True:
#       raise ValueError("Superuser must have is_staff=True.")

#     if kwargs.get("is_superuser") is not True:
#       raise ValueError("Superuser must have is_superuser=True")

#     if not email:
#       raise ValueError("Email is required")

#     user = self.model(email=email, **kwargs)
#     user.set_password(password)
#     user.save()

#     return user


# # auto_now_add will set the timezone.now upon instance creation
# # auto_now will set the timezone.now() upon save()
# class CustomUser(AbstractBaseUser, PermissionsMixin):
#   fullname = models.CharField(max_length=255)
#   email = models.EmailField(unique=True)
#   role = models.CharField(max_length=8, choices=Roles)
#   created_at = models.DateTimeField(auto_now_add=True)
#   updated_at = models.DateTimeField(auto_now=True)
#   is_staff = models.BooleanField(default=False)
#   is_superuser = models.BooleanField(default=False)
#   is_active = models.BooleanField(default=True)
#   last_login = models.DateTimeField(null=True)

#   USERNAME_FIELD = "email"
#   objects = CustomUserManager()

#   def __str__(self) -> str:
#     return self.email

#   class Meta:
#     ordering = ("created_at",)