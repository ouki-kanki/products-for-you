import React from 'react'
import { usePagination } from '../../../hooks/usePagination'
import styles from './favoriteProducts.module.scss'
import { useClassLister } from '../../../hooks/useClassLister'
import { NavLink } from 'react-router-dom'

import { Pagination } from '../../../components/Pagination/Pagination'
import { withLoadingAndError } from '../../../hocs/LoadingError/withLoadingAndError'
import { ProductPreview1 } from '../../../components/Product/ProductPreviewV1/ProductPreview1'

// TODO: replace Record with the actual product type
interface IfavoriteProductsProps {
  data: Record<string, string>[];
  isLoading: boolean;
  isError: boolean;
}

const queryObj = {
  sort_by: 'yoyo'
}

export const FavoriteProducts = withLoadingAndError(({ data }: IfavoriteProductsProps) => {
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
          className={styles.favoriteProductsContainer}
          key={product.slug}
          >
          <ProductPreview1
            name={product.name}
            slug={product.slug}
            price={product.price}
            thumb={product.product_thumbnails[0].url}
            layout='listLayout'
          />
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
