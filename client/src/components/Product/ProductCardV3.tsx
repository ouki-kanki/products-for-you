import styles from './productCardV3.module.scss'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { BaseButton } from '../Buttons/baseButton/BaseButton';

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
  title: string;
  price: string;
  selectedVariation: {}
  productThumbnails?: []
}


export const ProductCardV3 = ({ product: { constructedUrl, slug, name, price, ...rest}} : IproductV3) => {
  const navigate = useNavigate()
  const [variationSlug, setVariationSlug] = useState<string>('')


  // TODO: dry this is used in featured and search pages. also need to refactor to use the active variation !
  const handleProductDetail = () => {
    navigate(`/products/${encodeURIComponent(constructedUrl)}/${slug}`, {
      state: constructedUrl
    })
  }

  // filter the default thumbnail
  const defaultThumb  = rest?.productThumbnails?.filter(thumb => thumb.isDefault)
    // .reduce((a, item) => item ? item[0].url : null, '')
    .reduce((a, product: { url: string; isDefault: boolean }) => product.url, '')


  return (
    <div
      className={styles.container}
      onClick={handleProductDetail}
      >
      <div className={styles.title}>{name}</div>
      <div className={styles.imageContainer}>
        <img
          className={styles.imageMain}
          src={defaultThumb ? defaultThumb : 'placeholder'} alt="" />
      </div>
      <div className={styles.price}>{price} $</div>
      <BaseButton>details</BaseButton>
    </div>
  )
}
