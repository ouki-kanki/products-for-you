import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import type { RootState, AppDispatch } from './../../store';
import type { TypedStartListening, TypedAddListener } from '@reduxjs/toolkit';
import { 
  addItem, 
  removeItem, 
  clearCart, 
  initCart,
  addQuantity,
  subtractQuantity } from "../../../features/cart/cartSlice"


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
  matcher: isAnyOf(addItem, removeItem, addQuantity, subtractQuantity, clearCart),
  effect: async (action, listenerApi) => {
    console.log(listenerApi.getState())
    const { cart } = listenerApi.getState()
    console.log(cart)
    localStorage.setItem('cart', JSON.stringify(cart))
  }  
})


