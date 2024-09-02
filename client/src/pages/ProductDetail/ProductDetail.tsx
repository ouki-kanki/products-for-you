import { useState, useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { addItem, activateCartUpdate, deactivateCartUpdate } from '../../features/cart/cartSlice'
import { useGetProductDetailQuery } from '../../api/productsApi'
import { Notification, showNotification } from '../../components/Notifications/Notification'


import styles from './productDetail.module.scss'
import ReturnIcon from '../../assets/svg_icons/return_icon.svg?react'
import TrackIcon from '../../assets/svg_icons/track.svg?react'
import AddIcon from '../../assets/svg_icons/add_filled.svg?react'
import SubtractIcon from '../../assets/svg_icons/subtract_filled.svg?react'

export const ProductDetail = () => {
  const dispatch = useDispatch()
  const { slug } = useParams()
  const { data, isLoading } = useGetProductDetailQuery(slug as string)
  const [featuredImage, setFeaturedImage] = useState('')
  const [desiredQuantity, setDesiredQuantity] = useState<number>(1)
  const location = useLocation()
  const featuredImageUrl = data?.productImages?.filter(image => image.isDefault)[0].url


  useEffect(() => {
    setFeaturedImage(featuredImageUrl as string)
  }, [featuredImageUrl])

  // console.log(data)

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

  const handleAddToCart = () => {
    if (data) {
      // TODO: the payload is of type any. fix that it will lead to pugs
      dispatch(addItem({
        variationName: data.variationName,
        productIcon: data.productThumbnails[0].url,
        slug: data.slug,
        constructedUrl: location?.state ? location.state : 'not_provided',
        price: data.price,
        productId: data.id,
        quantity: desiredQuantity
      }))

      dispatch(activateCartUpdate())
      setTimeout(() => {
        dispatch(deactivateCartUpdate())
      }, 700)
    }
  }

  const handleNavigateToImage = () => {
    // TODO: have to find a better way to handle this
    window.location.href = featuredImage;
    // TODO: this does not behave as expected. why ?
    // navigate(featuredImage, { replace: true })
  }


  if (isLoading) {
    return (
      <div>Loading</div>
    )
  }

  const handleTestNontification = () => {
    // setShowNotification(true)
    showNotification({
      message: 'yoyoy',
      duration: 2000,
      position: 'top-right',
      appearFrom: 'from-right',
      overrideDefaultHideDirection: true,
      hideDirection: 'to-top'
    })
  }

  return (
    <div className={styles.container}>
      <div onClick={handleTestNontification} style={{ cursor: 'pointer' }}>test notif</div>
      {data && (
          <div className={styles.sectionOne}>
            <div className={styles.leftContainer}>
              <div className={styles.featuredImage} onClick={handleNavigateToImage}>
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
                <h2>{data.variationName}</h2>
                <div className={styles.description}>
                  {data.detailedDescription}
                </div>
                <div className={styles.priceContainer}>
                  <div>Price</div>
                  <div>${data.price}</div>
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
            </div>
          </div>
      )}
    </div>
  )
}
