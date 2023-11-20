import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';

type AuthState = {
  userId: number | null,
  token: string | null
}

const slice = createSlice({
  name: 'auth',
  initialState: { userId: null, token: null } as AuthState,
  reducers: {
   setCredentials: (
      state,
      { payload: { userId, token }}: PayloadAction<{userId: number; token: string}>
   ) => {
    state.userId = userId,
    state.token = token
   } 
  }
})

export const { setCredentials } = slice.actions;
export default slice.reducer
export const selectCurrentUserId = (state: RootState) => state.auth.userId