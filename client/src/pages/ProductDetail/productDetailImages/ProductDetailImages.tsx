import styles from './productDetailImages.module.scss'
import type { IproductDetail } from '../../../api/types';

interface ProductDetailImagesProps {
  handleNavigateToImage: () => void;
  handleSetMainImage: (value: string) => void;
  featuredImage: string;
  data: IproductDetail;
}


export const ProductDetailImages = ({
  handleNavigateToImage,
  handleSetMainImage,
  featuredImage,
  data
}: ProductDetailImagesProps ) => {
  return (
    <>
      <div className={styles.featuredImage} onClick={handleNavigateToImage}>
        <img src={featuredImage} alt="main product image" />
      </div>
      <div className={styles.secondaryImages}>
        {data.productImages.map((image, index) => (
          <div
            className={styles.imageContainer}
            onClick={() => handleSetMainImage(image.url)}
            key={index}
            >
            <img src={image.url} alt="product not main image" />
          </div>
        ))}
      </div>
    </>
  )
}
