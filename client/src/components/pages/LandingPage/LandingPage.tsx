import { useState } from 'react'
import { useGetLatestProductsQuery } from "../../../api/productsApi"
import { ProductV2 } from "../../Product.tsx/ProductV2"

import { Grid } from "../../../UI/Layout/Grid/Grid";

import { FeaturedProducts } from './FeaturedProducts';
import { LatestProducts } from './LatestProducts';
// TODO : move from here
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

interface IProduct  {
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

  return (
    <div>
      <button onClick={switchView}>switch</button>
      {productView === 'products' && renderProducts()}
      <LatestProducts data={latestProducts}/>
      <FeaturedProducts/>
    </div>
  )
}
