import { createSlice } from '@reduxjs/toolkit';
import type { NotificationProps } from '../../components/Notifications/_Notification';

export interface NotificationWithId extends NotificationProps {
  id: number
}

type InitialState = Array<NotificationWithId>
const initialState: InitialState = []


export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.push({
        ...action.payload
      })
    },
    removeNotification: (state, action) => {
      return state.filter(notification => notification.id !== action.payload)
    }
  }
})

export const { addNotification, removeNotification } = notificationSlice.actions
export default notificationSlice.reducer
