from decimal import Decimal
from django.conf import settings
from django.shortcuts import redirect, get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
import stripe
from common.exceptions import exceptions

from products.models import ProductItem
from inventory.models import Store
from shopping_cart.models import Cart
from shopping_cart.serializers import CartSerializer

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

        # TODO: support multiple stores
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
            try:
                product_id = item.get('productId')
                product_item = ProductItem.objects.select_related('product_details').get(uuid=product_id)
                volume = product_item.product_details.volume
                weight = product_item.product_details.weight
                item_volumes.append({
                    'volume': volume,
                    'weight': weight
                })
            except ProductItem.DoesNotExist:
                return Response({
                    "message": 'item in cart not found'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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


# TODO: gather the type from the fron to give option for paypal or other means
# TODO: store the amounts in cents in the shipping plan options
class CreatePaymentIntentAPIView(APIView):
    def post(self, request): # noqa

        user = request.user
        if request.user.is_authenticated:
            cart = Cart.objects.get(user=user)
            sub_total = cart.sub_total
        else:
            cart = request.session.get('cart', [])
            sub_total = cart.get('total')

        # take plan uuid  from the front and find the plan find the location and add to the total cost
        plan_option_id = request.data.get('planId')
        plan = get_object_or_404(ShippingPlanOption, uuid=plan_option_id)
        tax_rate = plan.destination.tax_rate.rate
        shipping_costs = plan.base_cost
        if plan.extra_fee:
            shipping_costs += plan.extra_fee

        total = Decimal(sub_total) * (1 + tax_rate / 100) + shipping_costs

        # stripe needs cents
        total = int(round(total, 2) * 100)
        try:
            payment_intent = stripe.PaymentIntent.create(
                amount=total,
                currency='usd',
                payment_method_types=['card']
            )
            return Response({
                'client_secret': payment_intent.client_secret
            })
        except Exception as e:
            return exceptions.generic_exception(e)


