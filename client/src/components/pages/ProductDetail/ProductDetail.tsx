import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useGetProductDetailQuery } from '../../../api/productsApi'
import styles from './productDetail.module.scss'

import ReturnIcon from '../../../assets/svg_icons/return_icon.svg?react'
import TrackIcon from '../../../assets/svg_icons/track.svg?react'

import { ModalCentered } from '../../Modal/ModalCentered/ModalCentered'

export const ProductDetail = () => {
  const { slug } = useParams()
  const { data, isLoading } = useGetProductDetailQuery(slug as string)
  const [featuredImage, setFeaturedImage] = useState('')
  const [desiredQuantity, setDesiredQuantity] = useState<number>(1)

  // console.log(featuredImage)
  console.log(data)
  
  const featuredImageUrl = data?.productImages?.filter(image => image.isFeatured)[0].url

  useEffect(() => {
    setFeaturedImage(featuredImageUrl as string)
  }, [featuredImageUrl])

  // console.log(featuredImage)

  const handleSetMainImage = (url) => {
    setFeaturedImage(url)
  }

  const handleIncrement = () => {
    if (data) {
      if (desiredQuantity === '') {
        setDesiredQuantity(1)
      }
      const { quantity } = data
      if (desiredQuantity >= Number(quantity)) {
        return
      } 
    }

    setDesiredQuantity((prevQnt) => prevQnt + 1)
  }

  const handleDecrement = () => {
    if (!data) {
      return 
    }

    if (desiredQuantity <= 0) {
      return
    }

    setDesiredQuantity(prevQnt => prevQnt - 1)
  }

  const handleQntChange = ({ target: { value: strValue } }: React.ChangeEvent<HTMLInputElement>) => {
    if (data) {
      const value = Number(strValue)
      if (!isNaN(value) && value >= 1 && value && value <= Number(data.quantity)) {
        setDesiredQuantity(value)
      } else if (strValue === ''){
        setDesiredQuantity('')
      }
    }
  }

  const handleBlur = () => {
    if (desiredQuantity === '') {
      setDesiredQuantity(1)
    }
  }


  if (isLoading) {
    return (
      <div>Loading</div>
    )
  }

  return (
    <div className={styles.container}>
      {data && (
          <div className={styles.sectionOne}>
            <div className={styles.leftContainer}>
              <div className={styles.featuredImage}>
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
            </div>
            <div className={styles.rightContainer}>
              <div className={styles.upper}>
                <h2>{data.name}</h2>
                <div className={styles.description}>
                  {data.detailedDescription}
                </div>
                <div className={styles.available}>
                  {Number(data?.quantity) > 0 ? 'Available' : 'Not Available'}
                </div>
                
                <div className={styles.action}>
                  <div className={styles.quantityBtnContainer}>
                    <input 
                      // type="number"
                      type='string'
                      value={desiredQuantity}
                      // min={0}
                      // max={data?.quantity} 
                      onChange={handleQntChange}
                      onBlur={handleBlur}
                      />
                    <div className={styles.plusMinusContainer}>
                      <button onClick={handleDecrement}>-</button>
                      <button onClick={handleIncrement}>+</button>
                    </div>
                  </div>
                  <button className={styles.buyBtn}>Add to cart</button>
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
                  <div>Free delivery</div>
                </div>
              </div>
            </div>
          </div>
      )}
    </div>
  ) 
}
