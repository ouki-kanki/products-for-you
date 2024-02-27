import { useReducer, ChangeEvent, FormEvent } from 'react'
import { Link } from 'react-router-dom';
import styles from './checkout.module.scss';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../app/store/store';
import { leftData, rightData } from '../../../data/checkoutFields';
import { useCreateOrderMutation } from '../../../api/orderApi';


interface ICheckoutState {
  firstName: string;
  lastName: string;
  shippingAddress: string;
  billingAddress: string;
  phoneNumber: string;
  userEmail: string;
  city: string;
  zipCode: string;
  [key: string]: string
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

type CheckoutAction = { type: 'CHANGE'; name: string; value: string };

const checkoutReducer = (state: ICheckoutState, action: CheckoutAction) => {
  switch(action.type) {
    case 'CHANGE':
      return {
        ...state,
        [action.name]: action.value 
      }
    default:
      return state
  }
}


export const Checkout = () => {
  const cart = useSelector((state: RootState) => state.cart)
  const [state, dispatch] = useReducer(checkoutReducer, initialState)

  const [ createOrder, { isLoading } ] = useCreateOrderMutation()
  
  // console.log(cart)
  // console.log(state)

  const handleChange = ({ target: { value, name }}: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'CHANGE', name, value })
  }

  const handleCheckout = async (e: FormEvent) => {
    e.preventDefault();

    // TODO: have to validate inputs . only then proceed!!!! 
    if (cart && Object.keys(cart).length > 0) {
      const total = cart.total
      const items = cart.items
      // console.log(items)

      const productsWithSnakeKeys = items.map(item => {
        return Object.keys(item).reduce((acc, key) => {
          const snake = key.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
          if (snake === 'product_id') {
            // server for produt_id needs the key 'product_item
            acc['product_item'] = item[key]
          } else if (snake === 'variation_name' || snake === 'product_icon') {
            return acc
          } else {
            acc[snake] = item[key]
          }
          return acc
        }, {})
      })

      const payload =  {
          user_id: '',
          ref_code: "not_provided",
          phoneNumber: state.phoneNumber,
          shipping_address: state.shippingAddress,
          billing_address: state.billingAddress,
          order_total: total,
          refund_status: "NOT_REQUESTED",
          order_item: productsWithSnakeKeys
        }

        // console.log(payload)

        try {
          const data = await createOrder(payload).unwrap()
          if (data) {
            console.log("data from sserver from created orde", data)
          }
        } catch (error) {
          console.log("the error on order", error)
        }
    }
  }
 
  // TODO: useValidation
  return (
    <div className={styles.container}>
      <div>
        <h1>Checkout</h1>
        <div>products_placeholder  __load_the_cart__</div>
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
        </div>
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
                    value={state[field.name]}
                    // required
                    />
                </div>
              ))}
            </div>

            <div className={`${styles.right} ${styles.section}`}>
              <h2>yoyo</h2>
              {rightData.map((field, id) => (
                <div key={id}>
                  <label htmlFor={field.id}>{field.label}</label>
                  <input 
                    className={styles.input} 
                    type={field.type} 
                    id={field.id}
                    name={field.name}
                    onChange={handleChange}
                    value={state[field.name]}
                    // required
                    />
                </div>
              ))}
              
            </div>                

          </div>
          <div className={styles.action}>
            <Link to='/cart' className={styles.btnBack}>back</Link>
            <button 
              className={styles.checkoutBtn}
              type='submit'
              >Place Order</button>
        </div>
      </form>
    </div>
  </div>
  )
}
