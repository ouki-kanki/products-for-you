import styles from './checkoutForm.module.scss'
import { leftData, rightData } from '../../../data/checkoutFields'
import { Link } from 'react-router-dom'
import { CardElement } from '@stripe/react-stripe-js';
import { Mode } from '../Checkout';

import { BaseButton } from '../../../components/Buttons/baseButton/BaseButton';

interface ICheckoutForm {
  mode: Mode
  handleBack: React.MouseEvent<HTMLButtonElement>
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

export const CheckoutForm = ({ handleCheckout, handleChange, handleBack, profileState, mode }:
 ICheckoutForm) => {
  return (
    <form className={styles.form} onSubmit={handleCheckout}>
      <div className={styles.innerContainer}>
        <div className={`${styles.left} ${styles.section}`}>
          <h2>Sheeping Details</h2>
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
        {mode === Mode.proccedToPayment && (
          <div className={styles.cardElementContainer}>
            <CardElement options={cardElementOptions}/>
          </div>
        )}
        <div className={styles.action}>
          <div className={styles.backContainer}>
            <BaseButton
              color='secondary'
              onClick={handleBack}
            >back</BaseButton>
          </div>
          <BaseButton
            // className={styles.checkoutBtn}
            // btn_type='success'
            type='submit'
            >{mode}</BaseButton>
      </div>
    </form>
  )
}
