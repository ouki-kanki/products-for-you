import { useEffect, useState } from 'react'
import styles from './landingPage.module.scss';
import { useGetLatestProductsQuery, useLazyGetFeaturedProductsQuery } from "../../api/productsApi"

import { FeaturedProducts } from './FeaturedProducts';
import { FeaturedProduct } from './FeaturedProduct';
import { ProductList } from '../../components/Product/ProductList/ProductList';

import { ProductV2 } from "../../components/Product/ProductV2"
import { LatestProducts } from './LatestProducts/LatestProducts';

import { Grid } from "../../UI/Layout/Grid/Grid";

// TODO: move from here
interface IVariationItem {
  variationName: string;
  value: string;
}

interface IVariation {
  id: number;
  quantity: number;
  price: string;
  productThumbnails: string[];
  variationDetails: IVariationItem[];
}

export interface IProductV4 {
  name: string;
  description: string;
  features: string[];
  category: string[];
  brand: string;
  icon: string;
  selectedVariation: IVariation;
  variations: {
    url: string,
    thumb: string
  }[]
}


export const LandingPage = () => {
  const { data: latestProducts, isLoading, isFetching } = useGetLatestProductsQuery('10')
  const [ fetchFeatured, { data: featuredData }] = useLazyGetFeaturedProductsQuery()
  const [ productView, setProductView ] = useState<string>('landing')

  useEffect(() => {
    const timerId = setTimeout(() => {
      fetchFeatured('10')
    }, 200)
    return () => clearTimeout(timerId)
  }, [])

  const renderProducts = () => (
      <Grid>
        {data && data.map(({ name, features, id, price}) => (
          <ProductV2
            name={name}
            price={price}
            features={features}
            id={id}
            key={id}/>
        ))}
      </Grid>
  )

  return (
    <div className={styles.container}>
      {productView === 'products' && renderProducts()}
      <div className={styles.latestProductsContainer}>
        <LatestProducts data={latestProducts}/>
      </div>

      <ProductList
        data={featuredData}
        title='Featured Products'
      />

      {/* <FeaturedProducts data={featuredData}/> */}

      {/* featured categories */}

      {/* TODO: remove this is for testing */}
      {latestProducts && (
        <FeaturedProduct data={latestProducts[4]}/>
      )}
    </div>
  )
}
