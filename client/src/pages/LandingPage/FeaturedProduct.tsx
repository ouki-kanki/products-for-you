import React from 'react'
import styles from './featuredProduct.module.scss'

import { IProduct } from '../../api/productsApi'

import { ProductV2 } from '../../components/Product/ProductV2'

interface IFeaturedProductProps {
  data: IProduct;
  isLoading: boolean;
  isError: boolean;
}


// TODO: is this obsolete?
export const FeaturedProduct = ({ data, isLoading, isError }: IFeaturedProductProps) => {

  if (isLoading) {
    return <div>Loading</div>
  }

  if (isError) {
    return <div>Could not load featured Item</div>
  }

  if (data && data.length > 0) {
    const featuredItem = data[0]
    return (
      <div className={styles.container}>
        <h2>Featured Product</h2>
        <div className={styles.featuredProductContainer}>
          <ProductV2
            width='wide'
            name={featuredItem.name}
            price={featuredItem.price}
            quantity={featuredItem.quantity}
            features={featuredItem.features}
            variations={featuredItem.variations}
            description={featuredItem.description}
            productImages={featuredItem.productImages}
            constructedUrl={featuredItem.constructedUrl}
            id={featuredItem.id}
            slug={featuredItem.slug}
          />
        </div>
      </div>
    )
  }
}
