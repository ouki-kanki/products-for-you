import { useState } from 'react'
import styles from './productV2.module.scss';
import type { WidthType } from '../../UI/Card/Card';

import { useHover } from '../../hooks/useHover';
import { useNavigate } from 'react-router-dom';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faStar } from '@fortawesome/free-regular-svg-icons';
import { faPlus, faStar as faSolidStar } from '@fortawesome/free-solid-svg-icons';


import { Card } from '../../UI/Card/Card';
import { Button } from '../../UI/Button/Button';

import kdeImage from '../../assets/kd14_low_res.png'
import kdeRight from '../../assets/kd14_right.jpg'
import kdeTop from '../../assets/kd14_top.jpg'
import kdeBack from '../../assets/kd14_back.jpg'

import kdWhiteYellow from '../../assets/variations/kd14_yel_white.jpg';
import kdIce from '../../assets/variations/kd14_ice.jpg';
import kdDeepBlue from '../../assets/variations/kd14_deep_blue.jpg'
import kdBl from '../../assets/variations/kd14var_bl_or.jpg';

import { IProduct } from '../../api/productsApi'; 


const formatPrice = (strNum: string) => {
  const num = Number(strNum).toLocaleString()
  return `${num} €`
  
}

interface IProductV2Props extends IProduct {
  width?: WidthType
}


export const ProductV2 = ({ 
  name: title, 
  price, 
  features, 
  id,
  slug,
  productThumbnails,
  quantity, 
  description,
  variations,
  constructedUrl,
  width = 'fluid' }: IProductV2Props) => {
  const { isHovered, isTempHovered, activateHover, deactivateHover } = useHover(undefined, 300)
  const [ currentImage, setCurrentImage ] = useState<string>(kdeImage)
  const navigate = useNavigate()


  const handleVariationChange = (index, productUrl) => {
    console.log("the index and product url", index, productUrl)
  }

  const handleProductDetail = () => {
    console.log(constructedUrl, id, slug)
    navigate(`/products/${encodeURIComponent(constructedUrl)}/${slug}`)
  }

  // console.log(variations)
  // console.log(productThumbnails)


  const renderVariations = () => {
    // console.log("the variations", variations)
    if (variations && variations.length > 0) {
      return (
        <div className={styles.variationsContainer}>
          {variations.map((variation, index) => (
            <div 
              className={styles.varImageContainer}
              key={index}
              onClick={() => handleVariationChange(index, variation.productUrl)}>
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
                <h3 className={styles.priceContainer}>price: {formatPrice(price)}</h3>

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
                {
                  quantity ? 
                    <div className={`${styles.label} ${styles.available}`}>available</div>
                           :
                    <div className={`${styles.label} ${styles.danger}`}>not available</div>
                }
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
            {productThumbnails && productThumbnails.length > 0 ? productThumbnails.map((thumb, index) => (
              <div onClick={() => setCurrentImage(thumb.url)} key={index}> 
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
