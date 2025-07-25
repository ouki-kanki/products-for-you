import styles from './productDetail.module.scss'
import type { Promotion } from '../../api/types'
import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { isEmpty } from '../../utils/objUtils'

import { useDispatch } from 'react-redux'
import { addItem, activateCartUpdate, deactivateCartUpdate } from '../../features/cart/cartSlice'
import { useLazyGetProductDetailQuery } from '../../api/productsApi'
import { useLazyGetListOfRatingsQuery } from '../../api/productsApi'
import { useLazyGetSimilarProductsQuery } from '../../api/productsApi'
import { useHandleFavoriteItem } from '../../hooks/useHandleFavoriteItems'

import { ProductDetails } from './ProductDetails/ProductDetails'
import { ProductDetailImages } from './productDetailImages/ProductDetailImages'
import { SimilarProducts } from '../../components/Product/SimilarProducts/SimilarProducts'
import {ProductDetailRatings } from './ProductDetailRatings/ProductDetailRatings'

export const ProductDetail = () => {
  const dispatch = useDispatch()
  const { handleFavorite } = useHandleFavoriteItem()
  const { slug } = useParams()
  const navigate = useNavigate()

  const [triggerFethProductDetail, { data, isLoading }] = useLazyGetProductDetailQuery()
  const [triggerFetchRatings, {data: ratingsData, isRatingsLoading}] = useLazyGetListOfRatingsQuery()
  const [triggerSimilarProducts, { data: similarProductsData, isLoading: isSimilarProductsLoading, isError: isSimilarProductsError }] = useLazyGetSimilarProductsQuery()
  const [featuredImage, setFeaturedImage] = useState('')
  const [desiredQuantity, setDesiredQuantity] = useState<number>(1)
  const location = useLocation()

  useEffect(() => {
    if (!slug) return;
    triggerFethProductDetail(slug)
  }, [slug, triggerFethProductDetail])

  // fetch ratings
  const product_item_uuid = data?.uuid
  useEffect(() => {
    if (!product_item_uuid) return;

    triggerFetchRatings(product_item_uuid)
  }, [product_item_uuid])

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

  let promotion = data?.promotions && data.promotions.length > 0 ?
                    data.promotions[0] :
                    null

  const validatePromotion = (promotion: Promotion) => {
    return promotion?.isActive ? promotion : null
  }

  promotion = validatePromotion(promotion as Promotion)

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

  const handleGoToCreateRating = (uuid: string) => {
    navigate(`/ratings/create/${uuid}`)
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
              <ProductDetailImages
                data={data}
                featuredImage={featuredImage}
                handleNavigateToImage={handleNavigateToImage}
                handleSetMainImage={handleSetMainImage}
              />
            </div>
      )}

      <div className={styles.sectionTwo}>
        <ProductDetails
          data={data}
          desiredQuantity={desiredQuantity}
          handleAddToCart={handleAddToCart}
          handleBlur={handleBlur}
          handleDecrement={handleDecrement}
          handleIncrement={handleIncrement}
          handleFavorite={handleFavorite}
          handleNavigateToVariation={handleNavigateToVariation}
          handleQntChange={handleQntChange}
          promotion={promotion}
        />
      </div>

      {similarProductsData && similarProductsData.length > 0 && (
        <div className={styles.sectionThree}>
          <h2>You may like</h2>
          <SimilarProducts
            data={similarProductsData}
            isLoading={isSimilarProductsLoading}
            isError={isSimilarProductsError}
          />
      </div>
      )}
      {ratingsData && !isEmpty(ratingsData) && (
        <div className={styles.sectionFour}>
          <ProductDetailRatings
            data={ratingsData}
            onCreateRating={() => handleGoToCreateRating(product_item_uuid)}
            />
        </div>
      )}
    </div>
  )
}
