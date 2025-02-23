import { useState, useEffect } from 'react'
import styles from './featuredProduct.module.scss'

import { IProduct } from '../../api/productsApi'
import { useDeleteFavoriteProductMutation, useAddFavoriteProductMutation } from '../../api/userApi'
import { ProductV2 } from '../../components/Product/ProductV2'

import { showNotification } from '../../components/Notifications/showNotification'
interface IFeaturedProductProps {
  data: IProduct;
  isLoading: boolean;
  isError: boolean;
}


export const FeaturedProduct = ({ data, isLoading, isError }: IFeaturedProductProps) => {
  const [isFavorite, setIsfavorite] = useState(false)
  const [addFavorite, { isLoading: isLoadingAddFavorite, isSuccess: isSuccessAddFavorite, isError: isErrorAddFavorite}] = useAddFavoriteProductMutation()
  const [deleteFavorite, { isLoading: isLoadingDeleteFavorite, isSuccess: isSuccessDeleteFavorite, isError: isErrorDeleteFavorite}] = useDeleteFavoriteProductMutation()

  if (isLoading) {
    return <div>Loading</div>
  }

  if (isError) {
    return <div>Could not load featured Item</div>
  }


  // TODO: check if the isFavorite field exists from the incoming data and if exist set the state

  const handleFavorite = async (slug: string) => {
    console.log("the item add fav slug", slug)
    // FOR TESTING ADD FAVORITE ALL THE TIME
    try {
      const res = await addFavorite({slug}).unwrap();
      console.log("the res form add", res)
      setIsfavorite(true)
    } catch (error) {
      console.log("the error add favorite", error)
      // TODO: if the error is 401 the user is not authorized notification suggest the user to login first
      showNotification({
        message: 'please login to add the product to favorites',
        type: 'danger',
      })
    }

    if (isFavorite) {
      // removefavorite
      // setState to isFavorite false
    } else {
      // addFavorite
      // setState isFavorite = true
    }
  }


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
            handleFavorite={() => handleFavorite(featuredItem.slug)}
            isFavorite={featuredItem.isFavorite}
          />
        </div>
      </div>
    )
  }
}
