from django.conf import settings
from django.shortcuts import redirect
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
import stripe


stripe.api_key = settings.STRIPE_SECRET_KEY


class StripeCheckoutAPIView(APIView):
    def post(self, request): # noqa
        try:
            checkout_session = stripe.checkout.Session.create(
                line_items= [
                    {
                        'price': 'test',
                        'quantity': 1

                    },
                ],
                payment_method_types=[
                    'card',
                    'acss_debit'
                ],
                mode='payment',
                success_url=settings.SITE_URL + '/payment-success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url=settings.SITE_URL + '/checkout?canceled=true'
            )

            return redirect(checkout_session.url)
        except stripe.error.CardError as e:
            body = e.json_body
            error = body.get('error', {})
            return Response({
                'message': 'your card was declined',
                'error': error.get('message')
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'message': 'could not complete payment',
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
