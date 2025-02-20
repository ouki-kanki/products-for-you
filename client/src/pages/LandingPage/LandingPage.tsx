import styles from './landingPage.module.scss';
import { useGetLatestProductsQuery,
         useGetFeaturedProductsQuery,
         useGetPromotedProductsQuery,
         useGetCategoriesQuery
         } from "../../api/productsApi"

import { FeaturedProduct } from './FeaturedProduct';
import { FeaturedProducts } from './FeaturedProducts/FeaturedPoroducts';
import { FeaturedCategories } from './FeaturedCategories/FeaturedCategories';

import { ProductV2 } from "../../components/Product/ProductV2"
import { LatestProducts } from './LatestProducts/LatestProducts';
import { PromotedProducts } from './PromotedProducts/PromotedProducts';


import { Grid } from "../../UI/Layout/Grid/Grid";

// TODO: move the types from here
interface IVariationItem {
  variationName: string;
  value: string;
}

// TODO: check productsApi for similar type, need to dry
interface IVariation {
  id: number;
  quantity: number;
  price: string;
  productThumbnails: string[];
  variationDetails: IVariationItem[];
}

// TODO: move from here to types
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
  const { data: latestProducts, isLoading: isLoadingLatest, isError: isErrorLatest} = useGetLatestProductsQuery('10')
  const { data: featuredProducts, isLoading: isLoadingFeatured, isError: errorFeatured} = useGetFeaturedProductsQuery(undefined, { skip: !latestProducts })
  const { data: promotedProducts, isLoading: isLoadingPromoted, isError: isErrorPromoted} = useGetPromotedProductsQuery(undefined, { skip: !featuredProducts })
  const { data: featuredCategories, isLoading: isLoadingCategories, isError: isErrorCategories} = useGetCategoriesQuery('featured', { skip: !promotedProducts })

  // console.log("latest", latestProducts)
  // console.log("featured", featuredProducts)
  // console.log("promoted", promotedProducts)
  // console.log("categories", featuredCategories)

  return (
    <div className={styles.container}>
      {/* {productView === 'products' && renderProducts()} */}

      <div className={styles.sectionContainer}>
        <LatestProducts data={latestProducts}/>
      </div>

      {featuredProducts ?
      <FeaturedProducts
        data={featuredProducts}
      /> :
      <div>Couldn't load featured products</div>
      }

      <FeaturedCategories
        data={featuredCategories}
        isLoading={isLoadingCategories}
        isError={isErrorCategories}
        />

      <PromotedProducts data={promotedProducts} isLoading={isLoadingPromoted}/>

      {/* TODO: remove this is for testing */}
      {/* {latestProducts && (
        <FeaturedProduct data={latestProducts[4]}/>
      )} */}
    </div>
  )
}
