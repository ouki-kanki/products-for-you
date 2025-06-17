import React from 'react'
import { usePagination } from '../../../hooks/usePagination'
import styles from './favoriteProducts.module.scss'

import { formatPrice } from '../../../utils/utils'
import { getPromotion } from '../../../utils/promotionValidate'
import { SalesBanner } from '../../../components/Product/SalesBanner/SalesBanner'
import { QuantityIndicator } from '../../../UI/Indicators/QuantityIndicator'

import { Pagination } from '../../../components/Pagination/Pagination'
import { withLoadingAndError } from '../../../hocs/LoadingError/withLoadingAndError'
// import { ProductPreview1 } from '../../../components/Product/ProductPreviewV1/ProductPreview1'

import { BtnCard } from '../../../components/Buttons/BtnCard/BtnCard'
// TODO: replace Record with the actual product type
interface IfavoriteProductsProps {
  data: Record<string, string>[];
  isLoading: boolean;
  isError: boolean;
  handleProductDetail: (path: string, slug: string) => void;
}

const queryObj = {
  sort_by: 'yoyo'
}

export const FavoriteProducts = withLoadingAndError(({ data, handleProductDetail }: IfavoriteProductsProps) => {
  const { handleNavigate, prepareLink, page, page_size } = usePagination(queryObj)

  if (data.results.length === 0) {
    return (
      <div>there no favorite products</div>
    )
  }

  return (
    <div className={styles.container}>
      {data && data.results.map(product => (
        <div
          className={styles.favoriteProductContainer}
          key={product.slug}
          >
            {getPromotion(product.promotions) && (
              <div className={styles.bannerContainer}>
                <SalesBanner
                  promotion={getPromotion(product.promotions)}
                  size='sm'
                  />
              </div>
            )}
            <div className={styles.imageContainer}>
              <img src={product.product_thumbnails[0].url} alt='product thumb'/>
            </div>

            <div className={styles.contentContainer}>
              <h2>{product.name}</h2>
              <div>
                {getPromotion(product.promotions) ? (
                  <div className={styles.promotionContainer}>
                    <div>${formatPrice(product.price)}</div>
                    <div>{formatPrice(product.promotions[0].promo_price)}</div>
                  </div>
                ) : (
                  <div>${formatPrice(product.price)}</div>
                )}
              </div>
              {/* <div>is available</div> */}
              <QuantityIndicator
                size='sm'
                availability={product.availability}/>
              <BtnCard handleClick={() => handleProductDetail(product.constructed_url, product.slug)}/>
            </div>
        </div>
      ))}

      <Pagination
        handleNavigate={handleNavigate}
        numberOfPages={data.num_of_pages}
        page={page}
        page_size={page_size}
        prepareLink={prepareLink}
        queryObj={queryObj}
      />
    </div>
  )
})
