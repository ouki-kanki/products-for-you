import styles from './landingPage.module.scss';
import { useGetLatestProductsQuery,
         useGetFeaturedProductsQuery,
         useGetPromotedProductsQuery,
         useGetCategoriesQuery
         } from "../../api/productsApi"

import { FeaturedProduct } from './FeaturedProduct';
import { FeaturedProducts } from './FeaturedProducts/FeaturedProducts';
import { FeaturedCategories } from './FeaturedCategories/FeaturedCategories';

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
  const { data: featuredProducts, isLoading: isLoadingFeatured, isError: isErrorFeatured} = useGetFeaturedProductsQuery(undefined, { skip: !latestProducts })
  const { data: promotedProducts, isLoading: isLoadingPromoted, isError: isErrorPromoted} = useGetPromotedProductsQuery(undefined, { skip: !featuredProducts })
  const { data: featuredCategories, isLoading: isLoadingCategories, isError: isErrorCategories} = useGetCategoriesQuery('featured', { skip: !promotedProducts })

  // console.log("latest", latestProducts)
  // console.log("featured", featuredProducts, isLoadingFeatured, isErrorFeatured)
  // console.log("promoted", promotedProducts)
  // console.log("categories", featuredCategories)

  return (
    <div className={styles.container}>
      <FeaturedProduct
        data={featuredProducts?.results}
        isLoading={isLoadingFeatured}
        isError={isErrorFeatured}
        />
      <LatestProducts data={latestProducts}/>

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
    </div>
  )
}
