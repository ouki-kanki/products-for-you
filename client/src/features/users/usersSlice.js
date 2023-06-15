import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  status: 'idle',
  error: ''
}

// fetchUsers is the actionCreator name
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (arg, thunkApi) => {
  try {
    const response = await fetch('http://localhost:8000/users/')
    console.log("the response raw", response)
    
    if (response.status !== 200) {
      throw new Error(response.statusText)
    }

    const data = await response.json()
    return data

  } catch(err) {
    const { message } = err
    console.log("this is the error --", message)
    // TODO: send action to show some kind feedback to the user
    // throw new Error(err)
    return thunkApi.rejectWithValue(message)
  }


})


export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    getUsers: (state, action) => {
      state.data = action.payload
    },
    addUser: (state) => {
      state.data.push({
        name: 'admin',
        isAdmin: true
      })
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchUsers.fulfilled, (state, { payload }) => {
        console.log("the action", { payload })
        state.data = payload ? payload : []
        state.status = 'idle'
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        console.log("the rejection isnide the reducer", action.payload)
        // TODO: clear the error after some time?
        state.error = action.payload
        state.status = 'idle'
      })
  }
})


export const { getUsers, addUser } = usersSlice.actions
export default usersSlice.reducer