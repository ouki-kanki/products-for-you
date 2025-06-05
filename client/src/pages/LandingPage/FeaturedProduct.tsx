import styles from './featuredProduct.module.scss'
import { useHandleFavoriteItem } from '../../hooks/useHandleFavoriteItems'

import { SectionContainer } from '../../components/Layout/SectionContainer/SectionContainer'
import { IProduct } from '../../api/types'
import { ProductV2 } from '../../components/Product/ProductV2'
import { withLoadingAndError } from '../../hocs/LoadingError/withLoadingAndError'

interface IFeaturedProductProps {
  data: IProduct[];
  isLoading: boolean;
  isError: boolean;
}


export const FeaturedProduct = withLoadingAndError(({ data }: IFeaturedProductProps) => {
  const { handleFavorite } = useHandleFavoriteItem()

  if (data && data.length > 0) {
    // selects the first item from featured products. the first item has position 1
    const featuredItem = data[0]
    return (
      <SectionContainer title='Featured Product' noLink={true}>
          <ProductV2
            width='fluid'
            name={featuredItem.name}
            price={featuredItem.price}
            quantity={featuredItem.quantity}
            availability={featuredItem.availability}
            features={featuredItem.features}
            variations={featuredItem.variations}
            description={featuredItem.description}
            productImages={featuredItem.productImages}
            constructedUrl={featuredItem.constructedUrl}
            id={featuredItem.id}
            slug={featuredItem.slug}
            handleFavorite={() => handleFavorite(featuredItem.slug, featuredItem.isFavorite)}
            isFavorite={featuredItem.isFavorite}
          />
      </SectionContainer>
    )
  }
})
