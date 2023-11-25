from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group
from django.db import models

from .models import CustomUser, UserDetail
from .forms import UserCreationForm, UserChangeForm
from widgets.custom_admin_widgets import CustomAdminFileWidget

admin.site.unregister(Group)

# NOTE: site=custom_admin_site indide the decorator to point to a custom admin site
@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    form = UserChangeForm
    add_form = UserCreationForm


    list_display = ('email', 'first_name', 'role', 'updated_at', 'created_at', 'is_staff')
    ordering = ('-created_at',)
    # exclude = ('date_joined', 'last_name', 'first_name')

    # this will show on form change 
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('username',)}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'user_permissions', 'role')}),
        ('Important dates', {'fields': ('last_login',)}),
        )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email',
                'username',
                'password1', 
                'password2', 
                'role',
                ),}),)



    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        is_superuser = request.user.is_superuser
        disabled_fields = set()

        # example to prevent certain field from showing up
        if not is_superuser:
            disabled_fields |= {
                'username',
                'is_superuser'
            }

        for field in disabled_fields:
            if field in form.base_fields:
                form.base_fields[field].disabled = True

        return form



@admin.register(UserDetail)
class UserDetailAdmim(admin.ModelAdmin):
    model = UserDetail
    list_display = ('user', 'first_name', 'last_name', 'created_at')

    formfield_overrides = {
        models.ImageField: { 'widget': CustomAdminFileWidget }
    }

    ordering = ('-created_at',)
# admin.site.register(UserDetail)