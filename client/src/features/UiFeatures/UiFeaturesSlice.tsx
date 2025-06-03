import { createSlice } from "@reduxjs/toolkit";

export interface UiState {
  isSidebarHidden: boolean,
  isCartModalOpen: boolean
}

const sidebarStateFromStorage = localStorage.getItem("is_sidebar_hidden")
const isMobile = window.innerWidth < 431

console.log("inside the slice", isMobile)

const initialState: UiState = {
  isSidebarHidden: sidebarStateFromStorage ? JSON.parse(sidebarStateFromStorage) : isMobile,
  isCartModalOpen: false
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
    },
    hideCartModal: state => {
      state.isCartModalOpen = false
    },
    showCartModal: state => {
      state.isCartModalOpen = true
    }
  }
})


export const { hideSidebar, showSidebar, hideCartModal, showCartModal } = uiFeaturesSlice.actions
export default uiFeaturesSlice.reducer
