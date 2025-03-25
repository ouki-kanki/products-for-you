import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import type { RootState, AppDispatch } from './../../store';
import type { CartItemForServer } from '../../../types/cartPayments';
import type { TypedStartListening, TypedAddListener } from '@reduxjs/toolkit';
import {
  addItem,
  removeItem,
  clearCart,
  initCart,
  addQuantity,
  subtractQuantity,
  checkout,
  sendInitCartToMiddleware,
  setIsSynced} from "../../../features/cart/cartSlice"

import type { ICartItem } from '../../../features/cart/cartSlice';
import { cartApi } from '../../../api/cartApi';
import { convertSnakeToCamelV2 } from '../../../utils/converters';

export const cartMiddleware = ({ dispatch, getState }) => next => action => {
  if (initCart.match(action)) {
    // const state = getState()
    // console.log("the add item action is triggered")
  }

  return next(action)
}

type CartStartListening = TypedStartListening<RootState, AppDispatch>
export const cartListenerMiddleware = createListenerMiddleware()
const startCartListening = cartListenerMiddleware.startListening as CartStartListening

startCartListening({
  matcher: isAnyOf(addItem, removeItem, addQuantity, subtractQuantity, clearCart, checkout, sendInitCartToMiddleware),
  effect: async (action, listenerApi) => {
    const dispatch = listenerApi.dispatch
    const { cart } = listenerApi.getState()
    const { auth: { userInfo: { user_id }, userTokens}} = listenerApi.getState()

    if (action.type === sendInitCartToMiddleware.type) {
      if (!user_id) {
        console.log("isndie the listern")
        // TODO: load from session
        try {
          const res = await dispatch(cartApi.endpoints.getSessionCart.initiate()).unwrap()
          console.log(res)
        } catch (err) {
          console.log(err)
        }
        return
      }

      // check if there is cart on localstorage
      let cartFromLocale;
      try {
        const cartFromStorageStr = localStorage.getItem('cart')
        cartFromLocale = JSON.parse(cartFromStorageStr as string)
      } catch (err) {
        // console.log(err)
        return
      }

      // *** run only if there is no cart in the localstorage ***
      if (!cartFromLocale || cartFromLocale.items.length === 0) {
        console.log("fetch cart from db... ")
        try {
          const res = await dispatch(cartApi.endpoints.getCart.initiate(user_id)).unwrap();
          const items = res.cart.items
          const convertedItems = []
          for (let item of items) {
            item = { ...item }
            for (const [key, value] of Object.entries(item)) {
              // TODO: check where the constructedUrl is used and change the name to urlPath
              // then remove this logic
              if (key === 'url_path') {
                item['constructedUrl'] = value
                delete item[key]
              }
              if (key === 'uuid') {
                item['productId'] = value
                delete item[key]
              }
            }
            item = convertSnakeToCamelV2(item)
            convertedItems.push(item)
          }

          const { total } = res.cart
          const numberOfItems = items.length
          const cart = {
            items: convertedItems,
            total,
            numberOfItems
          }

          dispatch(initCart(cart))
        } catch  (err){
          console.log(err)
        }

      }
        // TOOD: make the route to get the cart protected, if the user does not have token do not fetch the cart
    }

    localStorage.setItem('cart', JSON.stringify(cart))

    if (action.type === checkout.type) {
      // set cart to database
      try {
        const items = [ ...cart.items ]
        const cartItems = items.map(({ constructedUrl, productIcon, slug, variationName, productId, ...rest}) => ({ ...rest, uuid: productId }))

        if (!user_id) {
          const res = await dispatch(cartApi.endpoints.createSessionCart.initiate({
            items: cartItems as CartItemForServer[]
          })).unwrap()
          console.log("the res from guest create", res)
        } else {
          // if the user is logged_in
          const res = await dispatch(cartApi.endpoints.createCart.initiate({
            items: cartItems
          })).unwrap();
          console.log("the res from createcart", res)
        }

      } catch (error) {
        console.log("the error", error)
        return
      }
    }

    if (action.type === clearCart.type) {
      console.log("inside clear cart")
      localStorage.setItem('cart', '')

      try {
        const res = await dispatch(cartApi.endpoints.deleteCart.initiate())
        console.log("cart delete on db")
      } catch (err) {
        console.log("clear cart from db er", err)
        return
      }
    }
  }
})

// exalted
// tx - rgb(117, 117, 11)
// db - rgb(125, 174, 0)
// bg - rgb(227, 245, 87)
