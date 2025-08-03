import requests
from django.conf import settings
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response


class RecaptchaVerifyMixin:
    recaptcha_secret_key = settings.RECAPTCHA_SECRET_KEY

    def _verify_recaptcha(self, token: str, action: str = None):
        url = "https://www.google.com/recaptcha/api/siteverify"
        data = {
            "secret": self.recaptcha_secret_key,
            "response": token
        }

        try:
            response = requests.post(url, data=data, timeout=5)
            result = response.json()
            # print(result)
        except requests.exceptions.Timeout as exp:
            raise ValidationError("reCAPTCHA service took long to respond") from exp

        if not result.get("success"):
            raise ValidationError("reCAPTHA verification failed")

        # TODO: verify score in relation with the type of action

    def verify_captcha_or_error_response(self, request, action=None):
        """_summary_

        Args:
            request: the request object
            action (_type_, optional): 'login, signup etc..'. Defaults to None.

        Returns:
            Response: the response with the error
        """
        token = request.data.get("recaptchaToken")

        try:
            self._verify_recaptcha(token, action)
        except ValidationError as e:
            return Response({
                "message": f"could not verify recaptcha: {str(e)}"
            }, status=status.HTTP_400_BAD_REQUEST)

        return False
