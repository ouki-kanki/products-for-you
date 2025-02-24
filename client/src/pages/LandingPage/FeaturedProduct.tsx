import styles from './featuredProduct.module.scss'
import { useHandleFavoriteItem } from '../../hooks/useHandleFavoriteItems'

import { IProduct } from '../../api/productsApi'
import { ProductV2 } from '../../components/Product/ProductV2'

interface IFeaturedProductProps {
  data: IProduct;
  isLoading: boolean;
  isError: boolean;
}


export const FeaturedProduct = ({ data, isLoading, isError }: IFeaturedProductProps) => {
  const { handleFavorite } = useHandleFavoriteItem()
  if (isLoading) {
    return <div>Loading</div>
  }

  if (isError) {
    return <div>Could not load featured Item</div>
  }
  // TODO: check if the isFavorite field exists from the incoming data and if exist set the state




  if (data && data.length > 0) {

    // selects the firts item. the first item has position 1
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
            handleFavorite={() => handleFavorite(featuredItem.slug, featuredItem.isFavorite)}
            isFavorite={featuredItem.isFavorite}
          />
        </div>
      </div>
    )
  }
}
