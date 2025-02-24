import { useAppDispatch } from "../hooks";
import { productsApi } from "../api";
import { useAddFavoriteProductMutation, useDeleteFavoriteProductMutation } from "../api/userApi";
import { showNotification } from "../components/Notifications/showNotification";
import { current } from '@reduxjs/toolkit'
import type { IServerErrorV2 } from '../../types'


export const useHandleFavoriteItem = () => {
  const dispatch = useAppDispatch()
  const [addFavorite, { isLoading: isLoadingAddFavorite, isSuccess: isSuccessAddFavorite, isError: isErrorAddFavorite}] = useAddFavoriteProductMutation()
  const [deleteFavorite, { isLoading: isLoadingDeleteFavorite, isSuccess: isSuccessDeleteFavorite, isError: isErrorDeleteFavorite}] = useDeleteFavoriteProductMutation()

  const handleFavorite = async (slug: string, isFavorite: boolean) => {

    if (isFavorite) {
      // removefavorite
      try {
        const res = await deleteFavorite({slug}).unwrap();
        dispatch(
          productsApi.util.updateQueryData('getFeaturedProducts', undefined, (draft) => {
            const product = draft.results.find(product => product.slug === slug )

            if (product) {
              product.isFavorite = false
            }
          })
        )
        showNotification({
          message: 'product removed from favorites'
        })
      } catch (error) {
        if (error.status === 401) {
          showNotification({
            message: 'please login',
            type: 'danger'
          })
        } else {
          showNotification({
            message: 'something went wrong',
            type: 'danger'
          })
        }
      }
    } else {
      // addFavorite
      try {
        // TODO: dry duplicate code
        const res = await addFavorite({slug}).unwrap();
        dispatch(
          productsApi.util.updateQueryData('getFeaturedProducts', undefined, (draft) => {
            const product = draft.results.find(product => product.slug === slug )

            if (product) {
              product.isFavorite = true
            }
          })
        )
        showNotification({
          message: 'product has added to the favorites'
        })
      } catch (error: unknown) {
        //  TODO: type the error - need to check if is of type {status, data }
        if (error.status === 401) {
          showNotification({
            message: 'please login to add the product to favorites',
            type: 'danger',
          })
        }
        else {
          showNotification({
            message: error.data.detail,
            type: 'danger'
          })
        }
      }
    }
  }

  return { handleFavorite }
}

