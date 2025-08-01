from django.conf import settings
from django.core.cache import cache
from rest_framework.throttling import UserRateThrottle, BaseThrottle


class _ResendEmailThrottle(UserRateThrottle):
    scope = 'resend_email'


class ResendEmailThrottle(BaseThrottle):
    """ limit calls to 1 every 30 sec using a flag stored in cache
        limit can be controled for THROTTLE_INTERVALS in settings
    """
    def allow_request(self, request, view):
        uidb64 = view.kwargs.get('user_id')
        if not uidb64:
            return False

        interval = settings.THROTTLE_INTERVALS.get('resend_email', 30)
        cache_key = f'resend_email_cooldown_for_{uidb64}'
        last_request = cache.get(cache_key)

        if last_request:
            return False

        cache.set(cache_key, True, timeout=interval)
        return True
