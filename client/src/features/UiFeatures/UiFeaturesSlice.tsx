import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";

export interface UiState {
  isSidebarHidden: boolean
}

const initialState: UiState = {
  isSidebarHidden: false
}

export const uiFeaturesSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    hideSidebar: state => {state.isSidebarHidden = true},
    showSidebar: state => {state.isSidebarHidden = false}
  }
})


export const { hideSidebar, showSidebar } = uiFeaturesSlice.actions
export default uiFeaturesSlice.reducer