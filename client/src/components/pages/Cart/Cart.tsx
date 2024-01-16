import React from 'react'
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import styles from './cart.module.scss';
import type { RootState } from '../../../app/store';
import { removeItem, activateCartUpdate, deactivateCartUpdate } from '../../../features/cart/cartSlice';

import RemoveIcon from '../../../assets/svg_icons/remove.svg?react'

export const Cart = () => {
  const dispatch = useDispatch()
  const cart = useSelector((state: RootState) => state.cart)

  console.log(cart)
  const total = cart.total
  return (
    <div className={styles.container}>
      <h2>Your Items</h2>
      <div className={styles.cartContainer}>
        <div className={`${styles.row} ${styles.tableHeader}`}>
          <div>icon</div>
          <div>title</div>
          <div>price</div>
          <div>quantity</div>
          <div>Total</div>
          <div></div>
        </div>
        {cart && cart.items.map(({ productIcon, price, quantity, variationName, productId }) => (
          <div className={styles.row}>
            <div>
              <div className={styles.iconContainer}>
                <img src={productIcon} alt='procuct icon' />
              </div>
            </div>
            <div>{variationName}</div>
            <div>{price}</div>
            <div>{quantity}</div>
            <div className={styles.total}>{price * quantity}</div>
            <div 
              className={styles.removeContainer}
              onClick={() => dispatch(removeItem(productId))}
              >
              <RemoveIcon className={styles.removeIcon}/>
            </div>
          </div>
        ))}

        <div className={styles.actionContainer}>
          <div className={styles.finalPriceContainer}>
            <div className={styles.actionRow}>
              <div>SubTotal</div>
              <div>{total}</div>
            </div>
            <div className={styles.actionRow}>
              <div>Tax</div>
              <div>24%</div>
            </div>
            <div className={styles.actionRow}>
              <div>Discount</div>
              <div>0</div>
            </div>
            <div className={styles.totalFinal}>
              <div>Total</div>
              <div>{cart.total}<span>€</span></div>
            </div>
            <div className={styles.orderBtnContainer}>
              <Link to='/checkout' className={styles.orderBtn}>Go to order</Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
