import { useEffect } from 'react';
import styles from './checkoutForm.module.scss'
import { leftData, rightData } from '../../../data/checkoutFields'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { CheckoutBtnMode } from '../../../enums';

import { BaseButton } from '../../../components/Buttons/baseButton/BaseButton';
import { BaseInput } from '../../../components/Inputs/BaseInput/BaseInput';

import { Stripe, StripeCardElement } from '@stripe/stripe-js';
import type { Field } from '../../../hooks/validation/useValidationV2';

import { cardElementOptions } from './checkoutFormConfig';
import type { Location } from '../../../types/cartPayments';

interface ICheckoutForm {
  mode: CheckoutBtnMode
  fields: Record<string, Field>;
  errors: Record<string, string[]>
  handleValidationBlur: (name: string) => void;
  handleBack: React.MouseEvent<HTMLButtonElement>;
  isLoading: boolean;
  paymentCallback: (cardElement: StripeCardElement, stripe: Stripe) => void;
  isFormValid: boolean;
  extraShippingDetailsValue: string
  locations: Location[]
}

export const CheckoutForm = ({ handleCheckout, handleChange, handleValidationBlur, handleBack, fields, extraShippingDetailsValue, errors, isLoading, isFormValid, mode, paymentCallback}:
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
          <h3>Shipping Details</h3>
          <div className={styles.innerContainer}>
            <div className={`${styles.left} ${styles.section}`}>
              {leftData.map((field, id) => (
                <div key={id}>
                  <BaseInput
                    label={field.label}
                    name={field.name}
                    type='input'
                    onChange={handleChange}
                    value={fields[field.name]?.value || ''}
                    required={fields[field.name]?.required}
                    errors={errors[field.name]}
                    onBlur={() => handleValidationBlur(field.name)}
                  />
                </div>
              ))}
            </div>

            <div className={`${styles.right} ${styles.section}`}>
              {rightData.map((field, id) => (
                <div key={id}>
                    <BaseInput
                      label={field.label}
                      name={field.name}
                      type='input'
                      onChange={handleChange}
                      value={fields[field.name]?.value || ''}
                      required={fields[field.name]?.required}
                      errors={errors[field.name]}
                      onBlur={() => handleValidationBlur(field.name)}
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
            <div
              className={styles.textArea}
            >
              <BaseInput
                type='text-area'
                value={extraShippingDetailsValue}
                name='extraShippingDetails'
                onChange={handleChange}
                rows={4}
                cols={20}
                onBlur={() => handleValidationBlur('extraShippingDetails')}
                label='extra details for shipping'
              />
            </div>
            <div className={styles.action}>
              <div className={styles.backContainer}>
                <BaseButton
                  type='button'
                  color='secondary'
                  onClick={handleBack}
                >back</BaseButton>
              </div>
              <BaseButton
                isLoading={isLoading}
                disabled={!isFormValid}
                type='submit'
                >{mode}</BaseButton>
          </div>
        </form>

      </div>
  )
}
