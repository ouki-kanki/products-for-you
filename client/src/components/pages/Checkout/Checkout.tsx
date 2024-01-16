import React from 'react'
import styles from './checkout.module.scss';

const leftData = [
  {
    label: 'First Name',
    id: 'first-name'
  },
  {
    label: 'Last Name',
    id: 'last-name'
  },
  {
    label: 'Shipping Address',
    id: 'shipping-address'
  },
  {
    label: 'Billing Address',
    id: 'billing-address'
  },
]

const rightData = [

]

export const Checkout = () => {
  // TODO: useValidation
  return (
    <div className={styles.container}>
      <div>
        <h1>Checkout</h1>
        <div>products_placeholder  __load_the_cart__</div>
        <form className={styles.form}>
          <div className={`${styles.left} ${styles.section}`}>
            <h2>Sheeping Details</h2>
            <div>
              <label htmlFor="first-name">First Name</label>
              <input className={styles.input} type="text" id='first-name' required/>
            </div>
            <div>
              <label htmlFor="last-name">Last Name</label>
              <input className={styles.input} type="text" id='first-name' required/>
            </div>
            <div>
              <label htmlFor="shipping-address">Shipping Address</label>
              <input className={styles.input} type="text" id='shipping-address' required/>
            </div>
            <div>
              <label htmlFor="billing-address">Billing Address</label>
              <input className={styles.input} type="text" id='billing-address' required/>
            </div>
          </div>

          <div className={`${styles.right} ${styles.section}`}>
            <h2>yoyo</h2>
            <div>
              <label htmlFor="phone-number">Phonenumber</label>
              <input className={styles.input} type="text" id='phone-number' required/>
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input className={styles.input} type="text" id='email' required/>
            </div>
            <div>
              <label htmlFor="city">City</label>
              <input className={styles.input} type="text" id='city' required/>
            </div>
            <div>
              <label htmlFor="zip-code">Zip Code</label>
              <input className={styles.input} type="text" id='zip-code' required/>
            </div>          
          </div>                
        </form>
      </div>
    </div>
  )
}
