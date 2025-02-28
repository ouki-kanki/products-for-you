import { useAppDispatch } from "../hooks";
import { productsApi } from "../api";
import { useAddFavoriteProductMutation, useDeleteFavoriteProductMutation } from "../api/userApi";
import { showNotification } from "../components/Notifications/showNotification";
import { current } from '@reduxjs/toolkit'

import type { IServerErrorV2 } from '../../types'
import type { AppDispatch } from "../app/store/store";


interface IUpdateCache {
  (query: string,
   slug: string,
   isFavorite: boolean,
   dispatch: AppDispatch): void
}

// TODO: the following is bad practice.manually update of the cache is better to be avoided
// cache has to reflect the data from server
// TODO have to refactor this,
// TODO DOES NOT UPDATE CACHE ON LATEST PRODUCTS

// NOTE: onlatest products it needs the number of products to as string in the parameter and not the slug
/**
 *
 * @param query - the name of the query for instance 'getLatestProducts'
 * @param slug - *** caution latest needs the number of products ***
 * @param isFavorite boolean
 * @param dispatch the dispatch function
 */
const updateArrayCache: IUpdateCache = (query, slug, isFavorite , dispatch) => {
  dispatch(
    productsApi.util.updateQueryData(query, undefined, (draft) => {
      console.log("the draft", current(draft), query)
      const product = draft.find(product => product.slug === slug )

      if (product) {
        product.isFavorite = isFavorite
      }
    }))
  }

/**
 *
 * @param query - the name of the query  for instance 'getLatestProducts'
 * @param slug
 * @param isFavorite
 * @param dispatch
 */
const updateArrayCacheWithPagination: IUpdateCache = (query, slug, isFavorite, dispatch) => {
    dispatch(
      productsApi.util.updateQueryData(query, undefined, (draft) => {
      console.log("the draft", current(draft), query)
      const product = draft.results.find(product => product.slug === slug )

      if (product) {
        product.isFavorite = isFavorite
      }
  }))
}

const updateInstanceCache: IUpdateCache = (query, slug: string, isFavorite: boolean, dispatch) => {
  dispatch(
    productsApi.util.updateQueryData(query, slug, (draft) => {
      console.log("the current instance", current(draft))
      draft.isFavorite = isFavorite
    })
  )
}

// TODO: manually update cache is not recomended. cache has to reflect the data from server
// check if there is a better way to tacle this
export const useHandleFavoriteItem = () => {
  const dispatch = useAppDispatch()
  const [addFavorite, { isLoading: isLoadingAddFavorite, isSuccess: isSuccessAddFavorite, isError: isErrorAddFavorite}] = useAddFavoriteProductMutation()
  const [deleteFavorite, { isLoading: isLoadingDeleteFavorite, isSuccess: isSuccessDeleteFavorite, isError: isErrorDeleteFavorite}] = useDeleteFavoriteProductMutation()

  const handleFavorite = async (slug: string, isFavorite: boolean) => {

    if (isFavorite) {
      // removefavorite
      try {
        const res = await deleteFavorite({slug}).unwrap();

        await Promise.all([
          updateArrayCache('getLatestProducts', "10", false, dispatch),
          updateInstanceCache('getProductDetail', slug, false, dispatch),
          updateArrayCacheWithPagination('getFeaturedProducts', slug, false, dispatch),
          updateArrayCache('getPromotedProducts', slug, false, dispatch),
        ])

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
          console.log("the error", error)
          showNotification({
            message: 'something went wrong',
            type: 'danger'
          })
        }
      }
    } else {
      // addFavorite
      try {
        const res = await addFavorite({slug}).unwrap();

        await Promise.all([
          updateArrayCache('getLatestProducts', "10", true, dispatch),
          updateInstanceCache('getProductDetail', slug, true, dispatch),
          updateArrayCacheWithPagination('getFeaturedProducts', slug, true, dispatch),
          updateArrayCache('getPromotedProducts', slug, true, dispatch),
        ])

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

