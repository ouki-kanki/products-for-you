from datetime import datetime
from typing import Optional

from django.utils import timezone, timesince

from rest_framework import status
from rest_framework.response import Response


class TempBanMixin:
    """temp ban the user after certain number of requests"""

    max_attempts = 5
    block_duration = 2

    def ban_after_many_requests(self, request) -> Optional[Response]:
        user = request.user
        if (user.is_authenticated and user.role == 'demo_user') or not user.is_authenticated:
            is_blocked = request.session.get('is_blocked')

            if is_blocked:
                is_blocked_timezone_obj = datetime.fromisoformat(is_blocked)

                if timezone.now() < is_blocked_timezone_obj:
                    time_diff = is_blocked_timezone_obj - timezone.now()
                    total_seconds = int(time_diff.total_seconds())
                    minutes_diff = int(total_seconds // 60.0)
                    seconds_diff = total_seconds % 60

                    return Response({
                        "message": f"to many attempts try again in {minutes_diff} min and {seconds_diff} sec"
                    }, status=status.HTTP_429_TOO_MANY_REQUESTS)

                del request.session['is_blocked']
                request.session['attempt'] = 0
                request.session.save()

            attempt_count = request.session.get('attempt', 0)

            if attempt_count >= self.max_attempts:
                request.session['is_blocked'] = (timezone.now() + timezone.timedelta(minutes=self.block_duration))\
                    .isoformat()
                request.session['attempt'] = 0
                request.session.save()
            else:
                request.session['attempt'] = attempt_count + 1
                request.session.save()
            return None

        else:
            return None



