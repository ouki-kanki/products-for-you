import { useState } from 'react'
import styles from './landingPage.module.scss';
import { useGetLatestProductsQuery } from "../../api/productsApi"
import { FeaturedProduct } from './FeaturedProduct';
import { ProductV2 } from "../../components/Product/ProductV2"

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
  const { data: latestProducts, isLoading } = useGetLatestProductsQuery('10')
  const [ productView, setProductView ] = useState<string>('landing')

  const switchView = () => {
    setProductView((prevView) => (
      prevView === 'landing' ? 'products' : 'landing'
    ))
  }

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
  if (latestProducts) {
    // console.log(latestProducts)
  }

  return (
    <div className={styles.container}>
      {/* <button onClick={switchView}>switch</button> */}
      {productView === 'products' && renderProducts()}
      <div className={styles.latestProductsContainer}>
        {/* <LatestProducts data={latestProducts}/> */}
      </div>
      {/* <FeaturedProducts/> */}
      {/* TODO: remove this is for testing */}
      {latestProducts && (
        <FeaturedProduct data={latestProducts[4]}/>
      )}
    </div>
  )
}
