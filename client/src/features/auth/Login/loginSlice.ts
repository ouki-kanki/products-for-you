import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../../app/store/store";

type AuthState = {
  userId: number | null;
  token: string | null;
};


// *** OBSOLETE ***

const slice = createSlice({
  name: "auth",
  initialState: { userId: null, token: null } as AuthState,
  reducers: {
    setToken: (state, { payload }: PayloadAction<string>) => {
      state.token = payload
    },
    setCredentials: (state, { payload: { userId, token },}: PayloadAction<{ userId: number | null; token: string | null }>
    ) => {
      (state.userId = userId), (state.token = token);
    },
    logOut: (state) => {
      state.userId = null;
      state.token = null;
    },
  },
});

export const { setCredentials, setToken, logOut } = slice.actions;
export default slice.reducer;
export const selectCurrentUserId = (state: RootState) => state.auth.userId;
export const selectToken = (state:RootState) => state.auth.token
