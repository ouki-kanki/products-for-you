from django.contrib import messages

# NOTE: not implemented
class ExceptionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        # Handle exceptions globally and display messages
        if hasattr(request, 'exception_message'):
            messages.error(request, request.exception_message)
        return response