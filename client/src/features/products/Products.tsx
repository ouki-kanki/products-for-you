import styles from './products.module.scss';
import { Product } from "../../components/Product.tsx/Product"
import { Modal } from '../../components/Modal/Modal';

export const Products = () => {
  const handleClose = () => {
    
  }


  return (
    <div className={styles.mainContainer}>
      <div className={styles.productsContainer}>
        {Array.from({length: 5}).map((_, i) => (
          <div className={styles.productContainer} key={i}>
            <Product title="yo"/>
          </div>
        ))}
      </div>
      <Modal isOpen={true} onClose={handleClose}>
        yoyoyo
      </Modal>
    </div>
  )
}
