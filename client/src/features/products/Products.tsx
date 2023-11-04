import styles from './products.module.scss';
import { Product } from "../../components/Product.tsx/Product"


export const Products = () => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.productsContainer}>
        {Array.from({length: 5}).map(_ => (
          <div className={styles.productContainer}>
            <Product title="yo"/>
          </div>
        ))}
      </div>
    </div>
  )
}
