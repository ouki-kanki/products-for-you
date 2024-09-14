import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store/store";


interface UserInfo {
  name: string | null;
}

interface UserTokens {
  accessToken: string;
  refreshToken: string;
}

interface Credentials extends UserTokens {
  user: string
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
      const { user, accessToken, refreshToken } = action.payload

      state.userInfo.name = user
      state.userTokens.accessToken = accessToken
      state.userTokens.refreshToken = refreshToken
    },
    logOut: state => {
      state.userInfo.name = null,
      state.userTokens = {} as UserTokens
    }
  },
  extraReducers: {}
})

export default authSlice.reducer
export const { setCredentials, logOut } = authSlice.actions
export const getAccessToken = (state: RootState) => state.auth.userTokens.accessToken
export const getRefreshToken = (state: RootState) => state.auth.userTokens.refreshToken
export const getUserInfo = (state: RootState) => state.auth.userInfo
export const getUserName = (state: RootState) => state.auth.userInfo.name

