import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "../../app/store/store";
export interface ICartItem {
  variationName: string;
  slug: string;
  constructedUrl: string;
  productIcon: string;
  productId: number;
  quantity: number;
  price: string;
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
      const item = action.payload
      const itemsFromState = state.items
      const itemIndex = state.items.findIndex(product => product.productId === item.productId)

      if (itemIndex !== -1) {
        itemsFromState[itemIndex].quantity += item.quantity
      } else {
        itemsFromState.push(item)
      }
      
      const total = state.total += (parseFloat(item.price) * item.quantity)
      const numberOfItems = state.items.length

      state.items = itemsFromState
      state.numberOfItems = numberOfItems
      state.total = total
    },
    removeItem: (state, action: PayloadAction<number>) => {
      const { items, total, numberOfItems } = state
      const productId = action.payload

      const itemIndex = items.findIndex(product => product.productId === productId)
      const item = items[itemIndex]
      const newItems = items.filter(item => item.productId !== productId)

      state.total = total - (item.price * item.quantity)
      state.items = newItems
      state.numberOfItems = numberOfItems - 1
    },
    addQuantity: (state, action: PayloadAction<{ productId: number, quantity?: number }>) => {
      const { items, total } = state
      const { productId, quantity = 1 } = action.payload
      const itemIndex = items.findIndex(product => product.productId === productId)

      // TODO: Change the total price 
      if (itemIndex !== -1) {
        items[itemIndex].quantity += quantity
        const price = items[itemIndex].price
        state.total = total + (parseFloat(price) * quantity)
      }
    },
    subtractQuantity: (state, action: PayloadAction<{ productId: number, quantity?: number }>) => {
      const { items, total } = state
      const { productId, quantity = 1 } = action.payload
      const itemIndex = items.findIndex(product => product.productId === productId)
      
      if (itemIndex !== -1) {
        items[itemIndex].quantity -= quantity
        const { price } = items[itemIndex]
        state.total = total - (parseFloat(price) * quantity)
      }
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
    initCart: (state, action: PayloadAction<{ items: ICartItem[], total: number, numberOfItems: number }>) => {
      const { items, total, numberOfItems } = action.payload

      state.items = items;
      state.total = total
      state.numberOfItems = numberOfItems
    },
  }
})



export const { addItem, removeItem, clearCart, initCart, activateCartUpdate, deactivateCartUpdate, addQuantity, subtractQuantity } = cartSlice.actions
export default cartSlice.reducer

// export const addQuantityAsync = createAsyncThunk('cart/addQuantityAndSaveToStorage', async ({ productId, quantity}: IQuantityPayload, {dispatch, getState}: { dispatch: AppDispatch, getState: () => RootState }) => {
//   dispatch(addQuantity(productId, quantity))

//   localStorage.setItem('cart', JSON.stringify(getState().cart))
// })


