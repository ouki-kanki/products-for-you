
from django.conf import settings
from django.shortcuts import redirect
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
import stripe
from common.exceptions import exceptions

from products.models import ProductItem
from inventory.models import Store
from .models import ShippingPlanOption, Location
from .serializers import ShippingPlanOptionSerializer
from .utils import shipping

stripe.api_key = settings.STRIPE_SECRET_KEY


class CalculateShippingCostsView(APIView):

    def post(self, request): # noqa
        data = request.data
        destination_city = data.get('city', '')
        destination_country = data.get('country', '')
        items = data.get('items', [])

        if not destination_city:
            return Response({
                'message': 'destination is missing'
            }, status=status.HTTP_400_BAD_REQUEST)

        if len(items) == 0:
            return Response({
                'message': 'cart is empty'
            })

        # NOTE: for now i will use the default store, in the feature when multiple stores are added the logic will change
        origin_instance = Store.objects.get(is_default=True)
        origin_city = origin_instance.city if isinstance(origin_instance, Store) else settings.DEFAULT_STORE_CITY

        try:
            location = Location.objects.get(abbreviation=destination_city)
            tax_rate = location.tax_rate.rate
        except Location.DoesNotExist:
            return Response({
                'message': 'cannot find destination, cannot calculate tax'
            }, status=status.HTTP_400_BAD_REQUEST)

        available_plans = []
        # TODO: call DHL API

        try:
            shipping_options = ShippingPlanOption.objects.filter(
                origin__abbreviation=origin_city,
                destination__abbreviation=destination_city
            ).select_related('plan')
        except ShippingPlanOption.DoesNotExist:
            return Response({
                'message': 'no available shipping plans found'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        item_volumes = []

        # preload all the details
        for item in items:
            product_id = item.get('productId')
            product_item = ProductItem.objects.select_related('product_details').get(id=product_id)
            volume = product_item.product_details.volume
            weight = product_item.product_details.weight
            item_volumes.append({
                'volume': volume,
                'weight': weight
            })

        plans = []
        for shipping_option in shipping_options:
            option_data = ShippingPlanOptionSerializer(shipping_option).data

            if shipping_option.plan.cost_per_kg:
                total_weight = shipping.get_weight(False, item_volumes)
                option_data['cost'] = total_weight * shipping_option.plan.cost_per_kg
                plans.append(option_data)
                continue

            dimensional_factor = shipping_option.plan.dimensional_factor

            total_dimensional_weight = shipping.get_weight(
                True, item_volumes, shipping.get_dimensional_weight, dimensional_factor
            )

            if not (shipping_option.min_weight_threshold < total_dimensional_weight < shipping_option.max_weight_threshold):
                continue

            cost = shipping_option.base_cost
            if shipping_option.extra_fee:
                cost += shipping_option.extra_fee

            option_data['cost'] = round(cost, 2)
            plans.append(option_data)

        return Response({
            "plans": plans,
            "tax_rate": tax_rate
        }, status=status.HTTP_200_OK)


class CreatePaymentIntentAPIView(APIView):
    def post(self, request): # noqa

        # take the items from the client
        # take the cart from the database or the cart from the session

        try:
            amount_in_cents = request.data.get('amount') * 100
            payment_intent = stripe.PaymentIntent.create(
                amount=amount_in_cents,
                currency='usd',
                payment_method_types=['card']
            )
            return Response({
                'client_secret': payment_intent.client_secret
            })
        except Exception as e:
            return exceptions.generic_exception(e)


# *** session view OBSOLETE ***
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


