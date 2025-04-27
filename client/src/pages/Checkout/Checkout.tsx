import { useMemo } from 'react';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Outlet, useLocation } from 'react-router-dom';
import styles from './checkout.module.scss';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store/store';
import { convertCamelToSnakeArr, convertCamelToSnake, prepareCartItems } from '../../utils/converters';

import type { ICartItem, IShippingCosts } from '../../types/cartPayments';
import type { ShippingPlan } from '../../types/cartPayments';

import { passWordValidator, notEmptyValidator, emailValidator } from '../../hooks/validation/validators';

import { showNotification } from '../../components/Notifications/showNotification';
import { CheckoutCostsTable } from './CheckoutCostsTable/CheckoutCostsTable';
import { CheckoutForm } from './CheckoutForm/CheckoutForm';

import { useCreatePaymentIntentMutation } from '../../api/paymentApi';
import { useGetUserProfileQuery } from '../../api/userApi';
import { useCreateOrderMutation } from '../../api/orderApi';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import type { Stripe, StripeCardElement, StripeError, } from '@stripe/stripe-js';
import { PaymentIntentStatus, CheckoutBtnMode } from '../../enums';

import { useValidationV2 } from '../../hooks/validation/useValidationV2';
import { useCalculateShippingCosts } from './hooks/useCalculateShippingCosts';
import { isEmpty } from '../../utils/objUtils';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY as string)

export const Checkout = () => {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [shippingPlan, setShippingPlan] = useState<ShippingPlan | null>(null)
  const [extraShippingDetails, setExtraShippingDetails] = useState('')
  const userId = useSelector<RootState>(state => state.auth.userInfo.user_id)
  const [mode, setMode] = useState<CheckoutBtnMode.calculateShipping | CheckoutBtnMode.proccedToPayment>(CheckoutBtnMode.calculateShipping)
  const [isLoading, setIsLoading] = useState(false)

  const { calculateShipping, isShippingCostsLoading, isShippingCostsSuccess, shippingCostsData } = useCalculateShippingCosts()

  const { data: profileData, refetch, isError: isProfileError, error: profileError, isLoading: isProfileLoading } = useGetUserProfileQuery()
  const [createPaymentIntent, {data: paymentData, isSuccess: isPaymentIntentSuccess, error: paymentIntentError, isError: isPaymentIntentError, isLoading: isPaymentIntentLoading}] = useCreatePaymentIntentMutation()
  const [ createOrder, { isLoading: isCreateOrderLoading } ] = useCreateOrderMutation()

  const [stripeRef, setStipeRef] = useState<Stripe | null>(null)
  const [cardElement, setCardElement] = useState<StripeCardElement | null>(null)


  useEffect(() => {
    if (isProfileError && userId) {
      showNotification({
        message: 'could not load profile data',
        type: 'danger'
      })
    }
  }, [isProfileError, userId])

  const cart = useSelector((state: RootState) => state.cart)


  // *** VALIDATION ***
  const { fields: validatedFields, errors: validationErrors, isFormValid, registerField, changeField, touchField } = useValidationV2({
    password: [passWordValidator, notEmptyValidator],
    firstName: [notEmptyValidator],
    userEmail: [emailValidator, notEmptyValidator],
    shippingAddress: [notEmptyValidator],
    billingAddress: [notEmptyValidator],
    phoneNumber: [notEmptyValidator, passWordValidator],
    city: [notEmptyValidator],
    state: [notEmptyValidator],
    country: [notEmptyValidator],
    zipCode: [notEmptyValidator],
  })

  // for field registration
  const fields = useMemo(() => [
    "firstName", 'lastName', 'shippingAddress', 'billingAddress',
    'phoneNumber', 'userEmail', 'city', 'state', 'country', 'zipCode',
  ], [])


  useEffect(() => {
    fields.forEach(field => registerField(field))
  }, [registerField, fields])

  const handleBlur = (name: string): void => {
    touchField(name)
  }


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

  const profileDataStr = JSON.stringify(profileData)

  useEffect(() => {
    // NOTE: the key for email form server is diff
    // address one is used  to fill the shipping address .
    if (profileDataStr) {
      const data = JSON.parse(profileDataStr)
      const payload = {
        ...data,
        userEmail: data.email,
        shippingAddress: data?.addressOne
      }

      // load profile data to the validation
      fields.forEach(field => {
        changeField(field, payload[field])
      })

    }
  }, [profileDataStr])

  const handleChange = ({ target: { value, name }}: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // do not run extradetails through validator
    if (name === 'extraShippingDetails') {
      setExtraShippingDetails(value)
    }
    changeField(name, value)
  }

  // 4242 4242 4242 4242  11/27 345

  const handleBack = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (location.pathname === '/checkout') {
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

  // *** CHECKOUT ***
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

    if (mode === CheckoutBtnMode.calculateShipping) {
      calculateShipping(items, validatedFields)
      return
    }

    try {
      // when the user clicks procced to payment
      setIsLoading(true)
      const { planOptionId } = shippingPlan as ShippingPlan
      const { client_secret } = await createPaymentIntent({ planId: planOptionId }).unwrap()
      const { firstName, lastName, userEmail, city, state, country, shippingAddress, billingAddress, zipCode, phoneNumber } = validatedFields

      const paymentMethodReq = await stripeRef?.createPaymentMethod({
        type: 'card',
        card: cardElement as StripeCardElement,
        billing_details: {
          name: `${firstName.value} ${lastName.value}`,
          email: userEmail.value,
          phone: phoneNumber.value,
          address: {
            city: city.value,
            line1: billingAddress.value,
            line2: shippingAddress.value,
            state: 'atica',
            postal_code: zipCode.value
          },
        }
      })

      if (!isEmpty(paymentMethodReq?.error as StripeError)) {
        setIsLoading(false)
        showNotification({
          message: paymentMethodReq?.error.message as string,
          type: 'danger'
        })
        return
      }

      if (isEmpty(paymentMethodReq as Record<string, unknown>) || !client_secret) {
        setIsLoading(false)
        showNotification({
          message: 'could not procceed to payment',
          type: 'danger'
        })
        return
      }

      // cofirm the payment
      const confirmedCardPayment = await stripeRef?.confirmCardPayment(client_secret, {
        payment_method: paymentMethodReq.paymentMethod?.id as string,
      })

      const copyCart = { ...cart, items: prepareCartItems([...cart.items])}

      // TODO: show what went wrong with the payment. take info form stripe obj
      if (confirmedCardPayment?.paymentIntent?.status !== PaymentIntentStatus.SUCCESS) {
        setIsLoading(false)
        showNotification({
          message: 'payment could not completed',
          type: 'danger'
        })
        return
      }

      const payload = {
        cart: copyCart,
        paymentId: confirmedCardPayment.paymentIntent.id,
        shippingPlanId: planOptionId,
        userDetails: {
          userId: userId as string || null,
          email: validatedFields.userEmail.value,
          firstName: validatedFields.firstName.value,
          lastName: validatedFields.lastName.value,
          phoneNumber: validatedFields.phoneNumber.value,
          extraShippingDetails: extraShippingDetails,
          address: {
            shippingAddress: shippingAddress.value,
            billingAddress: validatedFields.billingAddress.value,
            city: validatedFields.city.value,
            state: validatedFields.state.value,
            country: validatedFields.country.value,
            postalCode: validatedFields.zipCode.value
          }
        }
      }

      const clean_payload = convertCamelToSnake({data: payload})
      // console.log("the clean payload", clean_payload)

      const data = await createOrder(clean_payload).unwrap()
      if (data) {
        console.log("data from sserver from created order", data)
        setIsLoading(false)
        showNotification({
          message: 'order created'
        })

        navigate('/order-success', {replace:true})
      }

    } catch (error) {
      setIsLoading(false)
      console.log("the error on order", error)
      if (error.status === 401) {
        showNotification({
          message: 'please login again',
          type: 'danger'
        })
      }
      else if (error?.data?.message) {
        showNotification({
          message: error.data.message,
          type: 'danger'
        })
      } else {
        showNotification({
          "message": 'something went wrong'
        })
      }

    }
  }


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
            fields={validatedFields}
            extraShippingDetailsValue={extraShippingDetails}
            errors={validationErrors}
            mode={mode}
            handleValidationBlur={handleBlur}
            isLoading={isPaymentIntentLoading || isShippingCostsLoading || isLoading}
            paymentCallback={(cardElement, stripe) => handlePaymentCallback(cardElement, stripe)}
            isFormValid={isFormValid}
          />
      </Elements>
    </div>
  </div>
  )
}
