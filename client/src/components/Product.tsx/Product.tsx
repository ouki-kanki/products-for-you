import {useState} from 'react'
import styles from './product.module.scss';

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


interface Iproduct {
  title: string
}


export const Product = ({ title }: Iproduct) => {
  const { isHovered, activateHover, deactivateHover } = useHover()

  const handleMouseEnter = () => {
    activateHover()
  }

  const handleMouseLeave = () => {
    deactivateHover()
  }

  return (
    <div>
      <Card width='medium'>
        <FontAwesomeIcon
          className={styles.heartIcon} 
          icon={faHeart} 
          size='2x'/>
        <div 
          className={styles.productContainer}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          >
          <div className={styles.topRegion}>
            <h2>asesome t-shirt!</h2>
          </div>
          <div className={styles.medRegion}>
            
            <div className={styles.ml}>
              <div className={styles.imageContainer}>
                <img 
                  src={kdeImage}
                  className={`${styles.imageMain} ${isHovered && styles.imageHovered}`} 
                  alt="shoe image" />
              </div>
            </div>

            <div className={styles.mr}>
              <div className={styles.mrFirst}>
                <h3 className={styles.priceContainer}>price: 100$</h3>
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
                  <li>jumping higher</li>
                  <li>boost</li>
                  <li>play better</li>
                </ul>
              </div>

            </div>
          </div>

          {/* <div className={styles.bottomRegion}>
            <ul>
              <li>waterproof</li>
              <li>flexible</li>
              <li>awesome</li>
            </ul>
          </div> */}
          <div className={styles.actionContainer}>
            <Button>buy now</Button>
            <FontAwesomeIcon
              className={styles.addIcon}
              icon={faPlus}
              size='2x'
              />    
          </div>
        </div>

        {/* view selectors */}
        <div 
          className={`${styles.productViewsContainer} ${isHovered && styles.productViewsContainer_stayBack}`}>
          <div>
            <img src={kdeRight} alt="right view of the product" />
          </div>
          <div>
            <img src={kdeTop} alt="top view of the product" />
          </div>
          <div>
            <img src={kdeBack} alt="back view of the product" />
          </div>
        </div>
      </Card>
    </div>
  )
}
