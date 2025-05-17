from decimal import Decimal
from datetime import datetime
from django.conf import settings
from django.http import Http404
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
import stripe
from common.exceptions import exceptions

from products.models import ProductItem
from inventory.models import Store
from shopping_cart.models import Cart
from shopping_cart.mixins import CartMixin, CartLockMixin
from mixins.throtle_temp_ban_mixins import TempBanMixin

from .models import ShippingPlanOption, Location
from .serializers import ShippingPlanOptionSerializer, LocationListSerializer
from .utils import shipping

stripe.api_key = settings.STRIPE_SECRET_KEY
PICKUP_PLAN_UUID = settings.PICKUP_PLAN_UUID


class LocationListview(APIView):

    def get(self, request, *args, **kwargs): # noqa
        locations = Location.objects.all()
        serializer = LocationListSerializer(locations, many=True)
        return Response({
            "message": serializer.data
        }, status=status.HTTP_200_OK)


class CalculateShippingCostsView(APIView):
    """
    returns a list of available plans for the current region
    """
    def post(self, request): # noqa
        data = request.data
        destination_city = data.get('city', '').strip().lower()
        destination_country = data.get('country', '').strip().lower()
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

        # if the destination is not in the availvable cities
        # then offer the pickup from store plan as an option

        # fetch the location to get the tax for the origin city
        origin_location_instance = Location.objects.get(abbreviation__iexact=origin_city)
        origin_tax = origin_location_instance.tax_rate.rate

        # return the pickup option if there no other shipping plans for the current destination,
        pickup_plan_instance = ShippingPlanOption.objects.get(uuid=PICKUP_PLAN_UUID)
        serializer = ShippingPlanOptionSerializer(pickup_plan_instance)
        pickup_plan = serializer.data

        # for the plans the cost is calculated and the added to the final json
        # here the cost needs to be added otherwise the client cannot calculate the total of the order
        pickup_plan['cost'] = 0

        destination_qs = Location.objects.filter(name__iexact=destination_city)

        #  return pickup from store to the user
        if not destination_qs.exists():
            return Response({
                "plans": [
                    {**pickup_plan}
                ]
            }, status=status.HTTP_200_OK)

        available_plans = []
        # TODO: call DHL API
        # check if dhl provides an api to calculate shipping costs

        try:
            shipping_options = ShippingPlanOption.objects.filter(
                origin__abbreviation=origin_city,
                destination__name__iexact=destination_city
            ).select_related('plan')
        except ShippingPlanOption.DoesNotExist:
            return Response({
                'message': 'no available shipping plans found'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        item_volumes = []

        # preload all the details
        for item in items:
            try:
                product_id = item.get('uuid')
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
            # ti will break on weight calculations
            # TODO: needs a more elegant way to handle this
            if str(shipping_option.uuid) == PICKUP_PLAN_UUID:
                continue
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
        old_plans = plans
        print(pickup_plan)
        print("the plans", plans)
        plans.append(pickup_plan)
        print("the new plans", plans)

        return Response({
            "plans": plans,
        }, status=status.HTTP_200_OK)


# TODO: add support for paypal payments
# TODO: store the amounts in cents in the shipping plan options
class CreatePaymentIntentAPIView(APIView, CartLockMixin, TempBanMixin):
    def post(self, request): # noqa
        ban_response = self.ban_after_many_requests(request)
        if ban_response:
            return ban_response
        user = request.user

        try:
            if request.user.is_authenticated:
                cart = get_object_or_404(Cart, user=user, status=Cart.Status.ACTIVE)
                sub_total = cart.sub_total
            else:
                cart = request.session.get('cart', {})
                if not cart:
                    return Response({
                        "message": 'cart is missing'
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                sub_total = cart.get('total')

            self.lock_cart(request, cart)

        except Http404:
            return Response({
                "message": 'there is a problem in the cart'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return exceptions.generic_exception(e)

        return Response({
            "message": 'test the api'
        }, status=status.HTTP_202_ACCEPTED)

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
                payment_method_types=['card'],
                metadata={"shippingPlanId": plan_option_id}
            )
            self.unlock_cart(request, cart)
            return Response({
                'client_secret': payment_intent.client_secret
            })
        except Exception as e:
            return exceptions.generic_exception(e)
        finally:
            self.unlock_cart(request, cart)


