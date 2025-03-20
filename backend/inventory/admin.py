from django.contrib import admin, messages
from .models import Store


@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        if obj.is_default:
            other_store_instances = Store.objects.filter(is_default=True)\
                .exclude(pk=obj.pk)
            if other_store_instances:
                other_store_instances.update(is_default=False)

                messages.warning(
                    request=request,
                    message=f"changed default store to {obj.name}"
                )

        super().save_model(request, obj, form, change)
