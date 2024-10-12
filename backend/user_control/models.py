from django.db import models
from django.contrib.auth.models import (
    UserManager,
    AbstractUser,
    AbstractBaseUser,
    PermissionsMixin
)
from datetime import timezone

from .managers import CustomUserManager, SoftDeleteManager
from common.util.static_helpers import make_thumbnail


from PIL import Image
from io import BytesIO

Roles = (
    ("admin", "admin"),
    ("assistant", "assistant"),
    ("editor", "editor"),
    ("sales_person", "sales_person"),
    ("customer", "customer"),
    ("visitor", "visitor")
)


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


class CustomUser(AbstractBaseUser, SoftDeleteModel, PermissionsMixin):
    email = models.EmailField(blank=True, default='', unique=True)
    username = models.CharField(max_length=255, blank=True, default='')
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    role = models.CharField(max_length=20, choices=Roles)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(blank=True, null=True)

    objects = CustomUserManager() # override the default UserManager

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = []

    @property
    def first_name(self):
        return 'have to  use user_detail'
        # if self.user_detail is None:
        #     return "michael jordan"
        # return self.user_detail.first_name

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        db_table = 'User'
        db_table_comment = "custom user table"
        ordering = ('created_at',)

    def __str__(self):
        return self.email


def get_user_image(self, path):
    return f'user_images/{self.pk}/user_image.png'


def get_default_user_image():
    return 'user_images/default_user_image.png'


class UserDetail(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=255, blank=True)
    last_name = models.CharField(max_length=255, blank=True)
    address_one = models.CharField(max_length=255, blank=True, default='')
    address_two = models.CharField(max_length=255, blank=True, default='')
    phone_number = models.CharField(max_length=20, blank=True, default='')
    cell_phone_number = models.CharField(max_length=20, blank=True, default='')
    city = models.CharField(max_length=255, blank=True, default='')
    country = models.CharField(max_length=255, blank=True, default='')
    image = models.ImageField(max_length=255, upload_to=get_user_image, null=True, blank=True, default=get_default_user_image)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def email(self):
        return self.user.email

    def get_image(self):
        # TODO: implement and test dynamic url 
        if self.image:
             return 'http://127.0.0.1:8000' + self.image.url
        return 'there is no image'

    def get_user_image_filename(self):
        """
        returns the path of user_icon
        """
        return str(self.image)[str(self.image).index(f'user_images/{self.pk}/'):]
    
    def save(self, *args, **kwargs):
        # super().save(*args, **kwargs)
        if self.image:
            self.image = make_thumbnail(self.image)
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} - {self.last_name}"
