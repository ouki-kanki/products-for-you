import { createSlice } from "@reduxjs/toolkit";

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
    hideSidebar: state => {
      localStorage.setItem("is_sidebar_hidden", JSON.stringify(true))
      state.isSidebarHidden = true
    }, 
    showSidebar: state => {
      localStorage.setItem("is_sidebar_hidden", JSON.stringify(false))
      state.isSidebarHidden = false
    }
  }
})


export const { hideSidebar, showSidebar } = uiFeaturesSlice.actions
export default uiFeaturesSlice.reducer