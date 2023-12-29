import { useState } from 'react'
import styles from './productV2.module.scss';

import { useHover } from '../../hooks/useHover';

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


export const ProductV2 = ({ name: title, price, features, id }: IProduct) => {
  const { isHovered, isTempHovered, activateHover, deactivateHover } = useHover(undefined, 300)
  const [ currentImage, setCurrentImage ] = useState<string>(kdeImage)


  return (
    // <div key={id}>
      <Card
        onMouseEnter={activateHover}
        onMouseLeave={deactivateHover}
        width='medium'
        >
        <FontAwesomeIcon
          className={`${styles.heartIcon} ${isTempHovered && styles.heartIconScale}`} 
          icon={faHeart} 
          size='2x'/>
        <div 
          className={styles.productContainer}
          >
          <div className={styles.topRegion}>
            <h2>{title}</h2>
          </div>
          <div className={styles.medRegion}>
            
            <div className={styles.ml}>
              <div className={styles.imageContainer}>
                <img 
                  src={currentImage}
                  className={`${styles.imageMain} ${isHovered && styles.imageHovered}`} 
                  alt="shoe image" />
              </div>
            </div>

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

                <div className={styles.available}>available</div>

              </div>
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

          <div className={styles.bottomRegion}>
            <div onClick={() => setCurrentImage(kdeRight)}>
              <img src={kdeRight} alt="right view of the product" />
            </div>
            <div onClick={() => setCurrentImage(kdeTop)}>
              <img src={kdeTop} alt="top view of the product" />
            </div>
            <div onClick={() => setCurrentImage(kdeBack)}>
              <img src={kdeBack} alt="back view of the product" />
            </div>
          </div>
          <div className={styles.actionContainer}>
            <Button>buy now</Button>
            <FontAwesomeIcon
              className={styles.addIcon}
              icon={faPlus}
              size='2x'
              />    
          </div>

          {/* <div className={`${styles.productPreview} ${styles.hidden}`}>
            <img src={currentImage} alt="product preview"/>
          </div> */}
        </div>

        {/* view selectors */}
        {/* <div 
          className={`${styles.productViewsContainer} ${isHovered && styles.productViewsContainer_stayBack}`}>
          <div
            onClick={() => setCurrentImage(kdeRight)}
          >
            <img src={kdeRight} alt="right view of the product" />
          </div>
          <div
            onClick={() => setCurrentImage(kdeTop)}
          >
            <img src={kdeTop} alt="top view of the product" />
          </div>
          <div
            onClick={() => setCurrentImage(kdeBack)}
            >
            <img src={kdeBack} alt="back view of the product" />
          </div>
        </div> */}
      </Card>
    // </div>
  )
}
