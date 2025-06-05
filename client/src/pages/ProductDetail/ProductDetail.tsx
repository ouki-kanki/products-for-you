import { useState, useEffect } from 'react'
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom'
import { isEmpty } from '../../utils/objUtils'

import { useDispatch } from 'react-redux'
import { addItem, activateCartUpdate, deactivateCartUpdate } from '../../features/cart/cartSlice'
import { useLazyGetProductDetailQuery } from '../../api/productsApi'
import { useLazyGetSimilarProductsQuery } from '../../api/productsApi'

import { SimilarProducts } from '../../components/Product/SimilarProducts/SimilarProducts'
import { showNotification } from '../../components/Notifications/showNotification'
import { FavoritesBtn } from '../../components/Buttons/FavoritesBtn/FavoritesBtn'
import { useHandleFavoriteItem } from '../../hooks/useHandleFavoriteItems'
import { QuantityIndicator } from '../../UI/Indicators/QuantityIndicator'

import styles from './productDetail.module.scss'
import ReturnIcon from '../../assets/svg_icons/return_icon.svg?react'
import TrackIcon from '../../assets/svg_icons/track.svg?react'
import AddIcon from '../../assets/svg_icons/add_filled.svg?react'
import SubtractIcon from '../../assets/svg_icons/subtract_filled.svg?react'


export const ProductDetail = () => {
  const dispatch = useDispatch()
  const { handleFavorite } = useHandleFavoriteItem()
  const { slug } = useParams()
  const navigate = useNavigate()

  // const { data, isLoading } = useGetProductDetailQuery(slug as string)
  const [trigger, { data, isLoading }] = useLazyGetProductDetailQuery()
  const [triggerSimilarProducts, { data: similarProductsData, isLoading: isSimilarProductsLoading, isError: isSimilarProductsError }] = useLazyGetSimilarProductsQuery()
  const [featuredImage, setFeaturedImage] = useState('')
  const [desiredQuantity, setDesiredQuantity] = useState<number>(1)
  const location = useLocation()
  // const [activeSlug, setActiveSlug] = useState(slug || '')

  // console.log("the active slug", activeSlug)

  console.log("the detai", data)


  useEffect(() => {
    if (slug) {
      trigger(slug)
    }
  }, [slug, trigger])

  // fetch similar products
  const category = data?.categories[data?.categories.length - 1]
  useEffect(() => {
    // only fetch when the productdata is here
    if (category) {
      triggerSimilarProducts({
        slug: slug as string,
        category: category as string
      })
    }
  }, [slug, category, triggerSimilarProducts])

  const featuredImageUrl = data?.productImages?.filter(image => image.isDefault)[0]?.url

  // console.log("data inside product detail", data)
  let promotion = data?.promotions && data.promotions.length > 0 ?
                    data.promotions[0] :
                    null


  const validatePromotion = (promotion) => {
    return promotion?.isActive ? promotion : null
  }

  promotion = validatePromotion(promotion)

  console.log('prmotion', promotion)

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

    if (desiredQuantity <= 1) {
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
        price: promotion ? promotion.promoPrice : data.price,
        productId: data.uuid,
        quantity: desiredQuantity
      }))

      dispatch(activateCartUpdate())
      setTimeout(() => {
        dispatch(deactivateCartUpdate())
      }, 700)
    }
  }

  const handleNavigateToVariation = (slug: string) => {
    // TODO: build the path on the back. there is allready a method to do that on product serializers
    const category = data?.categories[data.categories.length - 1]
    const path = `/products/${encodeURIComponent(category as string)}/${slug}`
    navigate(path)
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

  // TODO: need to handle this situation better
  if (!data) {
    return (
      <h3>we are sorry, could not find info for the current product.</h3>
    )
  }

  return (
    <div className={styles.container}>
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
            </div>
          </div>
      )}

        {similarProductsData && similarProductsData.length > 0 && (
          <div className={styles.sectionTwo}>
            <h2>You may like</h2>
            <SimilarProducts
              data={similarProductsData}
              isLoading={isSimilarProductsLoading}
              isError={isSimilarProductsError}
            />
        </div>
        )}
    </div>
  )
}
