import { useState } from 'react';
import styles from './products.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { Card } from '../../UI/Card/Card'
import kdeImage from '../../assets/kd14_low_res.png'


interface Iproduct {
  title: string
}


export const Products = ({ title }: Iproduct) => {
  const [isHovered, setIshovered] = useState(false)

  const handleMouseEnter = () => {
    setIshovered(true)
  }

  const handleMouseLeave = () => {
    setIshovered(false)  
  }




  // TODO: refactor to new component "Product", import type from types.
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
            <div className={styles.mr}>yoyo</div>
          </div>
          <div className={styles.bottomRegion}>
            <ul>
              <li>waterproof</li>
              <li>flexible</li>
              <li>awesome</li>
            </ul>
          </div>
          <div className={styles.actionContainer}>
            <button className={styles.quickCheckoutIcon}>quick checkout</button>
            <FontAwesomeIcon
              className={styles.addIcon}
              icon={faPlus}
              size='2x'
              />    
          </div>
        </div>
      </Card>
    </div>
  )
}
