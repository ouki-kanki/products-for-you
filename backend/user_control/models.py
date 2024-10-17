import hashlib

from django.core.exceptions import SuspiciousFileOperation
from django.core.files.storage import default_storage
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
    encoded_id = hashlib.sha256(str(self.pk).encode()).hexdigest()
    return f'user_images/{encoded_id}/user_image.png'


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
        print("the image is: ", self.image.url)
        if self.image:
             return 'http://127.0.0.1:8000' + self.image.url
        return 'there is no image'

    def get_user_image_filename(self):
        """
        returns the path of user_icon
        """
        return str(self.image)[str(self.image).index(f'user_images/{self.pk}/')]

    @staticmethod
    def delete_previous_image(instance):
        image_instance = getattr(instance, 'image')
        image_path = image_instance.path

        try:
            default_storage.delete(image_path)
        except SuspiciousFileOperation:
            print("cannot delete")
        except Exception as e:
            print("there was an error", e)
    
    def save(self, *args, **kwargs):
        if self.pk:
            prev_instance = UserDetail.objects.get(pk=self.pk)
            if self.image and self.image != prev_instance.image:
                self.delete_previous_image(prev_instance)
                try:
                    self.image = make_thumbnail(self.image)
                except ValueError as e:
                    raise e
        else:
            if self.image.url != '/media/user_images/default_user_image.png':
                self.image = make_thumbnail(self.image)
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} - {self.last_name}"
