class CustomFilterMixin:
    def get_active_users(self):
        return self.queryset.filter(status='active')