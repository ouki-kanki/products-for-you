import { IServerError } from '../../types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BASE_URL } from '../../api/baseConfig';

import { IPayload as IProductsState, IServerError } from '../../types';
import { fetchUsers } from '../users/usersSlice';


interface Iproduct {
  name: string,
  brand: string,
  slug: string,
  productVariations: [],
} 


const initialState = {
  data: [],
  status: 'idle',
  error: '' 
}

// NOTE: extra reducers when you want to call actions from another slice or from asyncthunk
export const fetchProducts = createAsyncThunk('procuts/fetchProducts', async (arg, thunkApi) => {
  try {
    const response = await fetch(`${BASE_URL}products`)

    if (response.status !== 200) {
      // TODO: dry it, it is used in many locations 
      throw new Error(response.statusText)
    }

    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof Error) {
      const { message } = error
      return thunkApi.rejectWithValue(message) 
    }
  }
})


export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {

  },
  extraReducers: builder => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.data = action.payload
      state.status = 'idle'
      state.error = ''
    })
    .addCase(fetchProducts.pending, (state) => {
      state.status = 'pending'
    })
    .addCase(fetchProducts.rejected, (state, action) => {
      if (action.payload instanceof Error) {
        state.error = action.payload
      }
    })
  }
})