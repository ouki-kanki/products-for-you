import styles from './products.module.scss';
import { Product } from "../../components/Product.tsx/Product"


export const Products = () => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.productsContainer}>
        {Array.from({length: 5}).map((_, i) => (
          <div className={styles.productContainer} key={i}>
            <Product title="yo"/>
          </div>
        ))}
      </div>
    </div>
  )
}
