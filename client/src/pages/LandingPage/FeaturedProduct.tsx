import React from 'react'
import styles from './featuredProduct.module.scss'

import { IProduct } from '../../api/productsApi'

import { ProductV2 } from '../../components/Product/ProductV2'

interface IFeaturedProductProps {
  data: IProduct
}


// TODO: is this obsolete?
export const FeaturedProduct = ({ data }: IFeaturedProductProps) => {
  // console.log(data)
  return (
    <div className={styles.container}>
      <h2>Featured Product</h2>
      <div className={styles.featuredProductContainer}>
        <ProductV2
          width='wide'
          name={data.name}
          price={data.price}
          quantity={data.quantity}
          features={data.features}
          variations={data.variations}
          description={data.description}
          productThumbnails={data.productThumbnails}
          constructedUrl={data.constructedUrl}
          id={data.id}
          slug={data.slug}
        />
      </div>
    </div>
  )
}
