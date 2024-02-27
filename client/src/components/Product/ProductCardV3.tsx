import styles from './productCardV3.module.scss'

export interface IproductThumbNailV3 {
  isFeatured: boolean;
  url: string
}

export interface IproductSelectedVariationV3 {
  constructedUrl: string;
  price: string;
  productThumbnails: IproductThumbNailV3[] 
}

export interface IproductV3 {
  brand: string;
  category: string[];
  description: string;
  features: string[];
  icon: string;
  name: string;
  selectedVariation: {}
}


export const ProductCardV3 = () => {
  return (
    <div className={styles.container}>productCardV3</div>
  )
}
