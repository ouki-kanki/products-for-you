import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BASE_URL } from '../../api/baseConfig';
import { IPayload as IUsersState } from '../../types';

// TODO: move it to another file 
// interface IServerError {
//   statusCode: number,
//   description: string,
//   message?: string
// } 

interface IUser {
  name: string,
  isAdmin: boolean
}

type IUsers = Array<IUser>

// interface IUsersState<T> {
//   data: Array<T>,
//   status: 'idle' | 'success' | 'error' | 'pending',
//   error: IServerError | string | unknown
// } 

const initialState: IUsersState<IUser> = {
  data: [],
  status: 'idle',
  error: ''
}



export const fetchUsers = createAsyncThunk('users/fetchUsers', async (arg, thunkApi) => {
  try {
    const response = await fetch(`${BASE_URL}users`)

    if (response.status !== 200) {
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


export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // TODO: this is wrong
    getUsers: (state, action: PayloadAction<IUsers>) => {
      state.data = action.payload
    },
    addUser: (state, action: PayloadAction<IUser>) => {
      state.data.push(action.payload)
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.data = action.payload
      state.status = 'idle'
      state.error = ''
    })
    .addCase(fetchUsers.pending, (state) => {
      state.status = 'pending'
    })
    .addCase(fetchUsers.rejected, (state, action) => {
      // TODO: typecheck this. 
      state.error = action.payload
    })
  }
})


export const { getUsers, addUser } = usersSlice.actions
export default usersSlice.reducer