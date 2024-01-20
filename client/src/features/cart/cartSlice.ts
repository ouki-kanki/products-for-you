import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface ICartItem {
  variationName: string;
  slug: string;
  constructedUrl: string;
  productIcon: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface ICart {
  items: ICartItem[];
  total: number;
  numberOfItems: number;
  isUpdating: boolean;
}

const initialState: ICart = {
  items: [],
  total: 0,
  numberOfItems: 0,
  isUpdating: false
}


export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<ICartItem>) => {
      // TODO: type for the action
      const item = action.payload
      // console.log("item inside add to cart", item)
      const itemsFromState = state.items
      const itemIndex = state.items.findIndex(product => product.productId === item.productId)
      if (itemIndex !== -1) {
        itemsFromState[itemIndex].quantity += item.quantity
      } else {
        itemsFromState.push(item)
      }
      
      const total = state.total += (item.price * item.quantity)
      const numberOfItems = state.items.length

      localStorage.setItem('cart', JSON.stringify({
        items: itemsFromState,
        total,
        numberOfItems
      }))

      state.items = itemsFromState
      state.numberOfItems = numberOfItems
      state.total = total
    },
    removeItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload
      const newItems = state.items.filter(item => item.productId !== itemId)
      localStorage.setItem('cart', JSON.stringify(newItems))
      state.items = newItems
    },
    activateCartUpdate: (state) => {
      state.isUpdating = true
    },
    deactivateCartUpdate: (state) => {
      state.isUpdating = false
    },
    clearCart: (state) => {
      localStorage.setItem('cart', '')
      return {
        items: [],
        total: 0,
        numberOfItems: 0
      }
    },
    initCart: (state) => {
      const cart: ICart = {
        items: [],
        total: 0,
        numberOfItems: 0,
        isUpdating: false
      }

      try {
        const strCartFromStorage = localStorage.getItem('cart')
        const cartFromStorage = JSON.parse(strCartFromStorage as string)
        const total = cartFromStorage.items.reduce((a, item: ICartItem) => a += (item.price * item.quantity), 0)
        const numberOfItems = cartFromStorage.items.length
        
        cart.items = cartFromStorage.items
        cart.total = total
        cart.numberOfItems = numberOfItems
      } catch (error) {
        console.log(error)
      }

      return cart
    },
  }
})

export const { addItem, removeItem, clearCart, initCart, activateCartUpdate, deactivateCartUpdate } = cartSlice.actions
export default cartSlice.reducer