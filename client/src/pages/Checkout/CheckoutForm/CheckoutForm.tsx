import { useEffect } from 'react';
import styles from './checkoutForm.module.scss'
import { leftData, rightData } from '../../../data/checkoutFields'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { CheckoutBtnMode } from '../../../enums';

import { BaseButton } from '../../../components/Buttons/baseButton/BaseButton';
import { Stripe, StripeCardElement } from '@stripe/stripe-js';

interface ICheckoutForm {
  mode: CheckoutBtnMode
  handleBack: React.MouseEvent<HTMLButtonElement>;
  isLoading: boolean;
  paymentCallback: (cardElement: StripeCardElement, stripe: Stripe) => void
}

// stripe.com/docs/js
const cardElementOptions = {
  style: {
    base: {
      color: 'hotpink',
      // "::placeholder": {
      //   // color: 'pink'
      // }
    },
    invalid: {
      // iconColor: 'tomato'
    },
    complete: {

    }
  },
  hidePostalCode: true
}


export const CheckoutForm = ({ handleCheckout, handleChange, handleBack, profileState, isLoading, mode, paymentCallback}:
  ICheckoutForm) => {
    const stripe = useStripe()
    const elements = useElements()

    useEffect(() => {
      const cardElement = elements?.getElement(CardElement)
      if (stripe && cardElement) {
        paymentCallback(cardElement as StripeCardElement, stripe as Stripe)
      }
    }, [stripe, elements, paymentCallback])

    return (
      <div>
        <form className={`${styles.form}`} onSubmit={handleCheckout}>
          <div className={styles.innerContainer}>
            <div className={`${styles.left} ${styles.section}`}>
              <h3>Sheeping Details</h3>
              {leftData.map((field, id) => (
                <div key={id}>
                  <label htmlFor={field.id}>{field.label}</label>
                  <input
                    className={styles.input}
                    type={field.type}
                    id={field.id}
                    name={field.name}
                    onChange={handleChange}
                    value={profileState[field.name]}
                    // required
                    />
                </div>
              ))}
            </div>

            <div className={`${styles.right} ${styles.section}`}>
              <h2>__placeholder__</h2>
              {rightData.map((field, id) => (
                <div key={id}>
                  <label htmlFor={field.id}>{field.label}</label>
                  <input
                    className={styles.input}
                    type={field.type}
                    id={field.id}
                    name={field.name}
                    onChange={handleChange}
                    value={profileState[field.name]}
                    // required
                    />
                </div>
              ))}
              </div>
            </div>
            {mode === CheckoutBtnMode.proccedToPayment && (
              <div className={styles.cardElementContainer}>
                <CardElement options={cardElementOptions}/>
              </div>
            )}
            <div className={styles.action}>
              <div className={styles.backContainer}>
                <BaseButton
                  type='button'
                  color='secondary'
                  onClick={handleBack}
                >back</BaseButton>
              </div>
              <BaseButton
                // className={styles.checkoutBtn}
                // btn_type='success'
                isLoading={isLoading}
                type='submit'
                >{mode}</BaseButton>
          </div>
        </form>

      </div>
  )
}
