import styles from './checkoutCostsTable.module.scss'
import type { ICart, ShippingPlan, IShippingCosts } from '../../../types/cartPayments'


interface CheckoutCostsTableProps {
  cart: ICart;
  shippingPlan: ShippingPlan
  shippingCostsData: IShippingCosts
}

export const CheckoutCostsTable = ({ cart, shippingPlan, shippingCostsData }: CheckoutCostsTableProps) => {

  console.log("product", cart)

  return (
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
    {shippingPlan?.cost > 0 && (
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
        <div>${shippingPlan?.taxRate}</div>
      </div>
    )}
    {shippingCostsData && shippingPlan && (
      <div className={`${styles.productRow} ${styles.itemRow}`}>
        <div></div>
        <div></div>
        <div>total cost</div>
        <div>${cart.total * (1 + Number(shippingPlan?.taxRate) / 100) + shippingPlan.cost}</div>
      </div>
    )}
  </div>
  )
}
