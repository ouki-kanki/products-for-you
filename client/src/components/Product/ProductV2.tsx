import { useState, useEffect } from 'react'
import styles from './productV2.module.scss';
import type { WidthType } from '../../UI/Card/Card';

import { useHover } from '../../hooks/useHover';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faStar } from '@fortawesome/free-regular-svg-icons';
import { faPlus, faStar as faSolidStar } from '@fortawesome/free-solid-svg-icons';

import { Card } from '../../UI/Card/Card';
import { Button } from '../../UI/Button/Button';
import { QuantityIndicator } from '../../UI/Indicators/QuantityIndicator';

import kdeImage from '../../assets/kd14_low_res.png'
import kdeRight from '../../assets/kd14_right.jpg'
import kdeTop from '../../assets/kd14_top.jpg'
import kdeBack from '../../assets/kd14_back.jpg'
import kdWhiteYellow from '../../assets/variations/kd14_yel_white.jpg';
import kdIce from '../../assets/variations/kd14_ice.jpg';
import kdDeepBlue from '../../assets/variations/kd14_deep_blue.jpg'

import { IProduct } from '../../api/productsApi';

import { useLazyGetProductVariationPreviewQuery } from '../../api/productsApi';


const formatPrice = (strNum: string) => {
  const num = Number(strNum).toLocaleString()
  return `${num} €`

}

interface IProductV2Props extends IProduct {
  width?: WidthType,
  shadow?: boolean
}


export const ProductV2 = ({
  name: title,
  price,
  features,
  slug,
  productThumbnails,
  quantity,
  description,
  variations,
  constructedUrl,
  shadow = true,
  width = 'fluid' }: IProductV2Props) => {
  const { isHovered, isTempHovered, activateHover, deactivateHover } = useHover(undefined, 300)
  const [ currentImage, setCurrentImage ] = useState<string>(kdeImage)
  const navigate = useNavigate()
  const [newQuantity, setNewQuantity] = useState<number | null>(null)
  const [variationPrice, setVariationPrice] = useState<string | null>(null)
  const [variationProductThumbnails, setVariationProductsThumbnails] = useState({})
  const [variationSlug, setVariationSlug] = useState<string>('')
  const [ trigger, result, lastPromiseInfo ] = useLazyGetProductVariationPreviewQuery()

  const strProductThumbnails = JSON.stringify(productThumbnails)
  const strVariationResult = result.data && JSON.stringify(result.data)

  useEffect(() => {
    if (strVariationResult) {
      const selectedVariation = JSON.parse(strVariationResult)
      setNewQuantity(selectedVariation.quantity)
      setVariationPrice(selectedVariation.price)
      setVariationProductsThumbnails(selectedVariation.productThumbnails)
      setVariationSlug(selectedVariation.slug)
    }
  }, [strVariationResult])

  useEffect(() => {
    setNewQuantity(quantity)
    setVariationPrice(price)

    // TODO: this is bad practice, have to find a more elegant solution
    setVariationProductsThumbnails(JSON.parse(strProductThumbnails))
    setVariationSlug(slug)
  }, [quantity, price, strProductThumbnails, slug])

  const handleVariationChange = (e: React.MouseEvent<HTMLDivElement>, slug: string) => {
    e.stopPropagation();

    // console.log("the index and product url", slug)
    trigger(slug)
  }

  const handleProductDetail = () => {
    navigate(`/products/${encodeURIComponent(constructedUrl)}/${variationSlug}`, {
      state: constructedUrl
    })
  }

  const handleSetMainImage = (e: React.MouseEvent<HTMLDivElement>, url: string) => {
    e.stopPropagation()
    setCurrentImage(url)
  }

  const renderVariations = () => {
    if (variations && variations.length > 0) {
      return (
        <div className={styles.variationsContainer}>
          {variations.map((variation, index) => (
            <div
              className={styles.varImageContainer}
              key={index}
              onClick={(e) => handleVariationChange(e, variation.slug)}>
              <img src={variation.thumb} alt="variation image" />
            </div>))}
        </div>
      )

    } else {
      return (
        <div className={styles.variationsContainer}>
          <div className={styles.varImageContainer}>
            <img src={kdDeepBlue} alt="variation image" />
          </div>
          <div className={styles.varImageContainer}>
            <img src={kdIce} alt="variation image" />
          </div>
          <div className={styles.varImageContainer}>
            <img src={kdWhiteYellow} alt="variation image" />
          </div>
        </div>
      )
    }
  }



  return (
    // <div key={id}>
      <Card
        onMouseEnter={activateHover}
        onMouseLeave={deactivateHover}
        width={width}
        shadow={shadow}
        >
        <FontAwesomeIcon
          className={`${styles.heartIcon} ${isTempHovered && styles.heartIconScale}`}
          icon={faHeart}
          size='2x'/>
        <div
          className={styles.productContainer}
          onClick={handleProductDetail}
          >
          <div className={styles.topRegion}>
            <h2>{title}</h2>
          </div>
          <div className={`${styles.medRegion} ${width === 'wide' && styles.wide}`}>

            <div className={styles.ml}>
              <div className={styles.imageContainer}>
                <img
                  src={currentImage}
                  className={`${styles.imageMain} ${isTempHovered && styles.imageHovered}`}
                  alt="shoe image" />
              </div>
            </div>
            {width === 'wide' && (
              <div className={styles.mm}>
                <div>
                  {description}
                </div>
              </div>
            )}

            <div className={styles.mr}>
              <div className={styles.mrFirst}>
                <h3 className={styles.priceContainer}>price: {formatPrice(variationPrice as string)}</h3>

                {/* TODO: move it to a seperate component */}
                <div className={styles.ratingsContainer}>
                <FontAwesomeIcon
                  className={styles.starIcon}
                  icon={faSolidStar}
                  size='lg'/>
                <FontAwesomeIcon
                  className={styles.starIcon}
                  icon={faSolidStar}
                  size='lg'/>
                <FontAwesomeIcon
                  className={styles.starIcon}
                  icon={faStar}
                  size='lg'/>
                </div>
                <QuantityIndicator quantity={newQuantity}/>
              </div>

              {/* VARIATIONS */}
              {renderVariations()}

              <div className={styles.contentContainer}>
                <h3>features</h3>
                <ul>
                  {features && features.map((feature, id) => (
                    <li key={id}>{feature}</li>
                  ))}
                </ul>
              </div>

            </div>

          </div>

          {/* Product views */}
          <div className={styles.bottomRegion}>
            {variationProductThumbnails && variationProductThumbnails.length > 0 ? variationProductThumbnails.map((thumb, index) => (
              <div onClick={(e) => handleSetMainImage(e, thumb.url)} key={index}>
                <img src={thumb.url} alt="top view of the product" />
              </div>)) : (
              <>
              {/* TODO: for testing remove if production !!! */}
                <div onClick={() => setCurrentImage(kdeRight)}>
                  <img src={kdeRight} alt="right view of the product" />
                </div>
                <div onClick={() => setCurrentImage(kdeTop)}>
                  <img src={kdeTop} alt="top view of the product" />
                </div>
                <div onClick={() => setCurrentImage(kdeBack)}>
                  <img src={kdeBack} alt="back view of the product" />
                </div>
              </>
              )
            }
          </div>
          <div className={styles.actionContainer}>
            <Button>buy now</Button>
            <FontAwesomeIcon
              className={styles.addIcon}
              icon={faPlus}
              size='2x'
              />
          </div>
        </div>
      </Card>
    // </div>
  )
}
