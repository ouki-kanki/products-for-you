import styles from './productCardV3.module.scss'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useProductNavigation } from '../../hooks/useProductNavigation';

import { BaseButton } from '../Buttons/baseButton/BaseButton';
import { formatPrice } from '../../utils/utils';

export interface IproductThumbNailV3 {
  isFeatured: boolean;
  url: string
}

export interface IproductSelectedVariationV3 {
  constructedUrl: string;
  price: string;
  productThumbnails: IproductThumbNailV3[]
}

interface Ipromotion {
  isActive: boolean;
  promoStart: string;
  promoEnd: string;
  promoPrice: string;
  promotionName: string;
  promoReduction: string;
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
  productThumbnails?: [];
  defaultThumb?: string;
  promotion?: Ipromotion;
  AsyncHandleClick?: () => Promise<void>;
  isAsyncClicked: boolean;
}

/**
 *
 * @param param0
 * @param isAsyncClicked - click the container will navitate the user if some functionality is needed
 * before navigation mark this to true and use handleClick handler
 * @returns
 */
export const ProductCardV3 = ({ product: { constructedUrl, slug, name, price, ...rest}, defaultThumb, handleClick, isAsyncClicked=false } : IproductV3) => {
  const navigate = useNavigate()
  const [variationSlug, setVariationSlug] = useState<string>('')
  const promotion = rest.promotions ? rest.promotions[0] : null
  const { goToProductDetailWithConstructedInput } = useProductNavigation()

  // TODO: dry this is used in featured and search pages. also need to refactor to use the active variation !
  const handleProductDetail = async () => {
    navigate(`/products/${encodeURIComponent(constructedUrl)}/${slug}`, {
      state: constructedUrl
    })
  }

  const handleProductDetailAsync = async () => {
    // used to sroll the user to the top inside similar products and then navigate
    await handleClick()
    goToProductDetailWithConstructedInput(constructedUrl, slug)
  }

  return (
    <div
      className={styles.container}
      onClick={isAsyncClicked ?  handleProductDetailAsync : handleProductDetail}
      >
      <div className={styles.title}>{name}</div>
      {promotion && (
        <div className={styles.salesBanner}>
          <div className={styles.salesName}>
            <div>ON SALE</div>
            <div>{promotion?.promoReduction} % <span>OFF</span></div>
          </div>
        </div>
      )}
      <div className={styles.imageContainer}>
        <img
          className={styles.imageMain}
          src={defaultThumb ? defaultThumb : 'placeholder'} alt="" />
      </div>
      <div className={styles.priceContainer}>
        {promotion ? (
          <div className={styles.priceSaleContainer}>
            <div className={styles.oldPrice}>{formatPrice(price)} $</div>
            <div className={styles.promoPrice}>{formatPrice(promotion.promoPrice)} $</div>
          </div>
        ) : (
          <div>{formatPrice(price)} $</div>
        )}
      </div>
      <BaseButton>details</BaseButton>
    </div>
  )
}
