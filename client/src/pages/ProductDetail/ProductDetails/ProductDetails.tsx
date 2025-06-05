import styles from './productDetails.module.scss';
import type { IproductDetail } from '../../../api/types'
import { Link } from 'react-router-dom';
import ReturnIcon from '../../../assets/svg_icons/return_icon.svg?react'
import TrackIcon from '../../../assets/svg_icons/track.svg?react'
import AddIcon from '../../../assets/svg_icons/add_filled.svg?react'
import SubtractIcon from '../../../assets/svg_icons/subtract_filled.svg?react'

import { showNotification } from '../../../components/Notifications/showNotification'
import { FavoritesBtn } from '../../../components/Buttons/FavoritesBtn/FavoritesBtn'
import { QuantityIndicator } from '../../../UI/Indicators/QuantityIndicator'

interface ProductDetailsProps {
  data: IproductDetail;
  handleFavorite: (slug: string, isFavorite: boolean) => void;
  promotion: {
    promoPrice: number;
  },
  desiredQuantity: number;
  handleQntChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: () => void;
  handleIncrement: () => void;
  handleDecrement: () => void;
  handleAddToCart: () => void;
  handleNavigateToVariation: (slug: string) => void;
}

export const ProductDetails = ({
  data,
  handleFavorite,
  promotion,
  desiredQuantity,
  handleQntChange,
  handleBlur,
  handleIncrement,
  handleDecrement,
  handleAddToCart,
  handleNavigateToVariation
}: ProductDetailsProps) => {
  return (
    <>
      <div>

      </div>
      <FavoritesBtn
          handleFavorite={() => handleFavorite(data.slug, data.isFavorite ?? false)}
          isFavorite={data.isFavorite ?? false}
        />
        {promotion && (
          <div className={styles.salesContainer}>Now on sale!</div>
        )}

        <div className={styles.upper}>
          <h2>{data.variationName}</h2>
          <div className={styles.description}>
            {data.detailedDescription}
          </div>
          <div className={styles.priceContainer}>
            <div>Price</div>
            <div className={styles.priceContainer}>
              {promotion ? (
                <div className={styles.promoContainer}>
                  <div>{data.price}$</div>
                  <div>{promotion.promoPrice}$</div>
                </div>
              ):
                <div>{data.price}$</div>
              }
            </div>
          </div>
          <QuantityIndicator availability={data.availability}/>

          <div className={styles.action}>
            <div className={styles.quantityBtnContainer}>
              <input
                // type="number"
                type='string'
                value={desiredQuantity}
                onChange={handleQntChange}
                onBlur={handleBlur}
                />
              <div className={styles.plusMinusContainer}>
                <button className={styles.qIcon} onClick={handleIncrement}>
                  <AddIcon/>
                </button>
                <button className={styles.qIcon} onClick={handleDecrement}>
                  <SubtractIcon/>
                </button>
              </div>
            </div>
            <button
              className={styles.buyBtn}
              onClick={handleAddToCart}
              >Add to cart</button>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.policyContainer}>
            <div className={styles.iconContainer}>
              <ReturnIcon className={styles.returnIcon}/>
            </div>
            <div>30 day return Policy</div>
          </div>
          <div className={styles.policyContainer}>
            <div className={styles.iconContainer}>
              <TrackIcon className={styles.trackIcon}/>
            </div>
            <Link to='/delivery-terms'>Free delivery</Link>
          </div>
        </div>
        <div className={styles.variations}>
          {data && data?.otherVariationsSlugs?.map(variation => (
            <div
              className={styles.variationsImageContainer}
              onClick={() => handleNavigateToVariation(variation.slug)}
              key={variation.slug}
              >
              <img src={variation.thumbUrl} alt='variation_url' />
            </div>
          ))}
        </div>
    </>
  )
}
