import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@reduxjs/toolkit/query';
import type { IUserProfile } from '../../api/userApi';


type IUserState = {
  profile: IUserProfile | null
}

const userSlice = createSlice({
  name: 'userV2',
  initialState: { profile: null } as IUserState,
  reducers: {
    setProfile: (state, { payload }: PayloadAction<IUserProfile>) => {
      state.profile = payload
    }
  }
})

export const { setProfile } = userSlice.actions
export default userSlice.reducer