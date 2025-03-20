import { useReducer, ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Outlet } from 'react-router-dom';
import styles from './checkout.module.scss';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store/store';
import { useCreateOrderMutation } from '../../api/orderApi';
import { convertCamelToSnakeArr } from '../../utils/converters';

import type { ICartItem } from '../../types/cartPayments';
import type { ShippingPlan } from '../../types/cartPayments';

import { fieldsReducer } from '../../app/reducers';
import { showNotification } from '../../components/Notifications/showNotification';
import { CheckoutForm } from './CheckoutForm/CheckoutForm';

import { useGetUserProfileQuery } from '../../api/userApi';
import { ActionTypesProfile } from '../../app/actions';

import { useCreatePaymentIntentMutation, useCalculateShippingCostsMutation } from '../../api/paymentApi';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import type { ICheckoutState } from '../../types/cartPayments';
export const enum Mode {
  calculateShipping = 'Calculate Shipping',
  proccedToPayment = 'Procced to Payment'
}

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
  const navigate = useNavigate()
  const [shippingPlan, setShippingPlan] = useState<ShippingPlan | null>(null)
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState<Mode.calculateShipping | Mode.proccedToPayment>(Mode.calculateShipping)

  const { data: profileData, refetch, isError: isProfileError, error: profileError, isLoading: isProfileLoading } = useGetUserProfileQuery()
  const [createPayment, {data: paymentData, isSuccess: isPaymentIntentSuccess, error: paymentIntentError, isError: isPaymentIntentError, isLoading: isPaymentIntentLoading}] = useCreatePaymentIntentMutation()
  const [calculateShippingCosts, {data: shippingCostsData, isSuccess: isShippingCostsSuccess, error: shippingCostsError, isError: isShippingCostsError, isLoading: isShippingCostsLoading}] = useCalculateShippingCostsMutation()
  const [ createOrder, { isLoading } ] = useCreateOrderMutation()

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
      setMode(Mode.proccedToPayment)
    } else {
      setMode(Mode.calculateShipping)
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

  const handleBack = () => {
    console.log("back btn")
    navigate(-1)
  }

  const handleShippingPlan = (plan: ShippingPlan) => setShippingPlan(plan)


  const handleCheckout = async (e: FormEvent) => {
    e.preventDefault();

    // TODO: have to validate inputs . only then proceed!!!!
    if (cart && Object.keys(cart).length > 0) {
      const total = cart.total
      const items = cart.items

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

      if (mode === Mode.calculateShipping) {
        // omit the fields that are not needed
        const filtered_items = items.map(({ price, productId, quantity }) => ({ price, productId, quantity }))
        // i need the location and the items
        // send request (items, country, city, shipping address, zip)
        try {
          const res = await calculateShippingCosts({
            city: profileState.city,
            zipCode: profileState.zipCode,
            items: filtered_items
          })


          navigate('payment')
        } catch (err) {
          console.log("shiipig cost error", err)
        }
        // setSate with the response and show the calculated cost
        return
      }

      try {
        // create a payment intent on the server
        // useCreatePaymentIntent
            // - amount (stripes needs the lowest denomination -> amount * 100)
            //

        // the response is the client secret of that payment
        // after the client secret create a payment method

        // need reference to the cardElement
        // need stripe.js

        // confirm the card payment
          // payement method id
          // client secret

        const data = await createOrder(payload).unwrap()
        if (data) {
          console.log("data from sserver from created order", data)
        }
      } catch (error) {
        console.log(error.status)
        if (error.status === 401) {
          showNotification({
            message: "Please login to place an order",
            type: 'danger'
          })
        }
        console.log("the error on order", error)
      }
    }
  }

  // TODO: useValidation
  return (
    <div className={styles.container}>
      <div>
        <h1>Checkout</h1>
        <div className={styles.productsContainer}>
          <div className={`${styles.productRow} ${styles.productsHeader}`}>
            <div>icon</div>
            <div>name</div>
            <div>quantity</div>
            <div>price</div>
          </div>
          {/* TODO: dry this .the logic is the same products inside the cart */}
          {cart.items.map((product, index) => (
            <div className={`${styles.productRow} ${styles.itemRow}`} key={index}>
              <div>
                <div className={styles.icon}>
                  <img src={product.productIcon} alt="product-icon"/>
                </div>
              </div>
              <div>{product.variationName}</div>
              <div>{product.quantity}</div>
              <div>${product.price}</div>
            </div>
          ))}
          {shippingPlan && (
            <div className={`${styles.productRow} ${styles.itemRow}`}>
              <div></div>
              <div></div>
              <div>shipping</div>
              <div>${shippingPlan?.cost}</div>
            </div>
          )}
          {shippingCostsData && (
            <div className={`${styles.productRow} ${styles.itemRow}`}>
              <div></div>
              <div></div>
              <div>tax rate</div>
              <div>${shippingCostsData.taxRate}</div>
            </div>
          )}
          {shippingCostsData && shippingPlan && (
            <div className={`${styles.productRow} ${styles.itemRow}`}>
              <div></div>
              <div></div>
              <div>total cost</div>
              <div>${shippingCostsData.taxRate + shippingPlan.cost + cart.total}</div>
            </div>
          )}
        </div>

        <Outlet context={{ plans: shippingCostsData ? shippingCostsData.plans : null, handleShippingPlan}}/>

      <Elements stripe={stripePromise}>
          <CheckoutForm
            handleCheckout={handleCheckout}
            handleBack={handleBack}
            handleChange={handleChange}
            profileState={profileState}
            mode = {mode}
          />
      </Elements>
    </div>
  </div>
  )
}
