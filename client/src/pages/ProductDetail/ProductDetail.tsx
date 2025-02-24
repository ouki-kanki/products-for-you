import { useState, useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { isEmpty } from '../../utils/objUtils'

import { useDispatch } from 'react-redux'
import { addItem, activateCartUpdate, deactivateCartUpdate } from '../../features/cart/cartSlice'
import { useGetProductDetailQuery, useLazyGetProductDetailQuery } from '../../api/productsApi'
import { showNotification } from '../../components/Notifications/showNotification'
import { FavoritesBtn } from '../../components/Buttons/FavoritesBtn/FavoritesBtn'
import { useHandleFavoriteItem } from '../../hooks/useHandleFavoriteItems'

import styles from './productDetail.module.scss'
import ReturnIcon from '../../assets/svg_icons/return_icon.svg?react'
import TrackIcon from '../../assets/svg_icons/track.svg?react'
import AddIcon from '../../assets/svg_icons/add_filled.svg?react'
import SubtractIcon from '../../assets/svg_icons/subtract_filled.svg?react'

export const ProductDetail = () => {
  const dispatch = useDispatch()
  const { handleFavorite } = useHandleFavoriteItem()
  const { slug } = useParams()

  // const { data, isLoading } = useGetProductDetailQuery(slug as string)
  const [trigger, { data, isLoading }] = useLazyGetProductDetailQuery()
  const [featuredImage, setFeaturedImage] = useState('')
  const [desiredQuantity, setDesiredQuantity] = useState<number>(1)
  const location = useLocation()
  const [activeSlug, setActiveSlug] = useState(slug || '')


  useEffect(() => {
    if (activeSlug) {
      trigger(activeSlug)
    }
  }, [activeSlug, trigger])

  const featuredImageUrl = data?.productImages?.filter(image => image.isDefault)[0]?.url

  // console.log("data inside product detail", data)
  let promotion = data?.promotions && data.promotions.length > 0 ?
                    data.promotions[0] :
                    null


  const validatePromotion = (promotion) => {
    return promotion?.isActive ? promotion : null
  }

  promotion = validatePromotion(promotion)

  useEffect(() => {
    setFeaturedImage(featuredImageUrl as string)
  }, [featuredImageUrl])

  const handleSetMainImage = (url: string) => {
    if (url) {
      setFeaturedImage(url)
    }
  }

  const handleIncrement = () => {
    if (!isEmpty(data)) {
      console.log(desiredQuantity)
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
      hideDirection: 'to-top',
      type: 'success'
    })
  }



  // TODO: change variation

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
                <div className={styles.available}>
                  {Number(data?.quantity) > 0 ? 'Available' : 'Not Available'}
                </div>

                <div className={styles.action}>
                  <div className={styles.quantityBtnContainer}>
                    <input
                      // type="number"
                      type='string'
                      value={desiredQuantity}
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
              <div className={styles.variations}>
                {data && data?.otherVariationsSlugs?.map(variation => (
                  <div
                    className={styles.variationsImageContainer}
                    onClick={() => setActiveSlug(variation.slug)}
                    key={variation.slug}
                    >
                    <img src={variation.thumbUrl} alt='variation_url' />
                  </div>
                ))}
              </div>
            </div>
          </div>
      )}
    </div>
  )
}
