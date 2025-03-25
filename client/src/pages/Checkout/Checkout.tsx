import { useReducer, ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Outlet, useLocation } from 'react-router-dom';
import styles from './checkout.module.scss';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store/store';
import { useCreateOrderMutation } from '../../api/orderApi';
import { convertCamelToSnakeArr, prepareCartItems } from '../../utils/converters';

import type { ICartItem, IShippingCosts } from '../../types/cartPayments';
import type { ShippingPlan } from '../../types/cartPayments';


import { fieldsReducer } from '../../app/reducers';


import { showNotification } from '../../components/Notifications/showNotification';
import { CheckoutCostsTable } from './CheckoutCostsTable/CheckoutCostsTable';
import { CheckoutForm } from './CheckoutForm/CheckoutForm';


import { useGetUserProfileQuery } from '../../api/userApi';
import { ActionTypesProfile } from '../../app/actions';

import { useCreatePaymentIntentMutation, useCalculateShippingCostsMutation } from '../../api/paymentApi';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import type { Stripe, StripeCardElement, } from '@stripe/stripe-js';
import type { ICheckoutState } from '../../types/cartPayments';
import { PaymentIntentStatus, CheckoutBtnMode } from '../../enums';


const initialState: ICheckoutState = {
  firstName: '',
  lastName: '',
  shippingAddress: '',
  billingAddress: '',
  phoneNumber: '',
  userEmail: '',
  city: '',
  zipCode: ''
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY as string)

export const Checkout = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [cardElement, setCardElement] = useState<StripeCardElement | null>(null)
  const [stripeRef, setStipeRef] = useState<Stripe | null>(null)
  const [shippingPlan, setShippingPlan] = useState<ShippingPlan | null>(null)
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState<CheckoutBtnMode.calculateShipping | CheckoutBtnMode.proccedToPayment>(CheckoutBtnMode.calculateShipping)

  const { data: profileData, refetch, isError: isProfileError, error: profileError, isLoading: isProfileLoading } = useGetUserProfileQuery()
  const [createPaymentIntent, {data: paymentData, isSuccess: isPaymentIntentSuccess, error: paymentIntentError, isError: isPaymentIntentError, isLoading: isPaymentIntentLoading}] = useCreatePaymentIntentMutation()
  const [calculateShippingCosts, {data: shippingCostsData, isSuccess: isShippingCostsSuccess, error: shippingCostsError, isError: isShippingCostsError, isLoading: isShippingCostsLoading}] = useCalculateShippingCostsMutation()
  const [ createOrder, { isLoading: isCreateOrderLoading } ] = useCreateOrderMutation()

  const cart = useSelector((state: RootState) => state.cart)
  const [profileState, dispatch] = useReducer(fieldsReducer<ICheckoutState>, initialState)
  const profileDataStr = JSON.stringify(profileData)

  useEffect(() => {
    const paymentCanceled = searchParams.get('canceled')

    if (paymentCanceled) {
      showNotification({
        message: 'payment was canceled',
        type: 'danger'
      })
    }
  }, [searchParams])

  useEffect(() => {
    if (location.pathname === '/checkout/payment') {
      setMode(CheckoutBtnMode.proccedToPayment)
    } else {
      setMode(CheckoutBtnMode.calculateShipping)
    }
            // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  useEffect(() => {
    // NOTE: the key for email form server is diff
    // also i use address one to fill the shipping address .
    if (profileDataStr) {
      const data = JSON.parse(profileDataStr)
      const payload = {
        ...data,
        userEmail: data.email,
        shippingAddress: data?.addressOne
      }

      dispatch({
        type: ActionTypesProfile.SET_PROFILE_DATA,
        payload
      })
    }
  }, [profileDataStr])

  const handleChange = ({ target: { value, name }}: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'CHANGE', name, value })
  }

  const handleBack = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (location.pathname === '/checkout') {
      console.log("inside the back in checkout")
      navigate('/cart')
    } else {
      navigate(-1)
    }
  }

  const handlePaymentCallback = (cardElement: StripeCardElement, stripe: Stripe) => {
    setCardElement(cardElement)
    setStipeRef(stripe)
  }

  const handleShippingPlan = (plan: ShippingPlan) => setShippingPlan(plan)

  const handleCheckout = async (e: FormEvent) => {
    e.preventDefault();

    if (!cart || Object.keys(cart).length === 0) {
      showNotification({
        message: 'cart is empty',
        type: 'caution'
      })
    }

    const total = cart.total
    const items = cart.items

    console.log("the items inside the cart", items)

    const payload =  {
        user_id: '',
        ref_code: "not_provided",
        phoneNumber: profileState.phoneNumber,
        shipping_address: profileState.shippingAddress,
        billing_address: profileState.billingAddress,
        order_total: total,
        refund_status: "NOT_REQUESTED",
        order_item: convertCamelToSnakeArr<ICartItem>({
          data: items,
          omitedKeys: ['variation_name', 'product_icon'],
          customConvertions: [
            {
              source: 'product_id',
              target: 'product_item'
            }
          ]
      })
    }

    if (mode === CheckoutBtnMode.calculateShipping) {
      // omit the fields that are not needed
      const filteredItems = prepareCartItems(items)
      // send request (items, country, city, shipping address, zip)
      try {
        const res = await calculateShippingCosts({
          city: profileState.city,
          zipCode: profileState.zipCode,
          items: filteredItems
        })


        navigate('payment')
      } catch (err) {
        console.log("shiipig cost error", err)
      }
      return
    }

    try {

      const { planOptionId } = shippingPlan as ShippingPlan
      const { client_secret } = await createPaymentIntent({ planId: planOptionId }).unwrap()
      const { firstName, lastName, userEmail, city, shippingAddress, zipCode } = profileState

      console.log("the client secret", client_secret)

      const paymentMethodReq = await stripeRef?.createPaymentMethod({
        type: 'card',
        card: cardElement as StripeCardElement,
        billing_details: {
          name: `${firstName} ${lastName}`,
          email: userEmail,
          address: {
            city,
            line1: shippingAddress,
            state: 'atica',
            postal_code: zipCode
          }
        }
      })

      console.log("the payment", paymentMethodReq)

      if (paymentMethodReq && client_secret) {
        // cofirm the payment
        const confirmedCardPayment = await stripeRef?.confirmCardPayment(client_secret, {
          payment_method: paymentMethodReq.paymentMethod?.id as string,
        })

        console.log("confirmed payment", confirmedCardPayment)

        const copyCart = { ...cart, items: prepareCartItems([...cart.items])}
        console.log("the prepared cart", copyCart)


        if (confirmedCardPayment?.paymentIntent?.status === PaymentIntentStatus.SUCCESS) {
          const payload = {
            cart,
            paymentId: confirmedCardPayment.paymentIntent.id,
            userDetails: {
              firstName,
              lastName: lastName,
              email: userEmail,
              address: {
                city,
                shippingAddress: shippingAddress,
                state: 'atica',
                postalCode: zipCode
              }
            }
          }

          const data = await createOrder(payload).unwrap()
          if (data) {
            console.log("data from sserver from created order", data)
          }
        }
      }
    } catch (error) {
      console.log(error.status)
      console.log("the error on order", error)

  }
      }

  // TODO: useValidation
  return (
    <div className={styles.container}>
      <div>
        <h1>Checkout</h1>
        <CheckoutCostsTable
          cart={cart}
          shippingPlan={shippingPlan as ShippingPlan}
          shippingCostsData={shippingCostsData as IShippingCosts}
        />

        <Outlet context={{ plans: shippingCostsData ? shippingCostsData.plans : null, handleShippingPlan}}/>

      <Elements stripe={stripePromise}>
          <CheckoutForm
            handleCheckout={handleCheckout}
            handleBack={handleBack}
            handleChange={handleChange}
            profileState={profileState}
            mode={mode}
            isLoading={isPaymentIntentLoading || isShippingCostsLoading}
            paymentCallback={(cardElement, stripe) => handlePaymentCallback(cardElement, stripe)}
          />
      </Elements>
    </div>
  </div>
  )
}
