import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store/store";


interface UserInfo {
  user: string | null;
  user_id: string;
}

interface UserTokens {
  accessToken: string;
}

interface Credentials extends UserTokens {
  user: string,
  userId: string;
}

interface AuthError {
  type: string;
  message: string;
}

interface InitialState {
  userInfo: UserInfo;
  userTokens: UserTokens;
  error: AuthError | null;
  loading: boolean;
  success: boolean;
}

const initialState: InitialState = {
  userInfo: {} as UserInfo,
  userTokens: {} as UserTokens,
  error: null,
  loading: false,
  success: false
}


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<Credentials>) => {
      const { user, accessToken, userId } = action.payload

      state.userInfo.user = user
      state.userInfo.user_id = userId
      state.userTokens.accessToken = accessToken
    },
    clearCredentials: state => {
      state.userInfo = {} as UserInfo,
      state.userTokens = {} as UserTokens
    }
  },
  extraReducers: {}
})

export default authSlice.reducer
export const { setCredentials, clearCredentials } = authSlice.actions
export const getAccessToken = (state: RootState) => state.auth.userTokens.accessToken
export const getUserInfo = (state: RootState) => state.auth.userInfo
export const getUser = (state: RootState) => state.auth.userInfo.user
export const getUserId = (state: RootState) => state.auth.userInfo.user_id
