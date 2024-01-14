import { createSlice } from "@reduxjs/toolkit";

export interface UiState {
  isSidebarHidden: boolean,
  isModalOpen: boolean
}

const initialState: UiState = {
  isSidebarHidden: false,
  isModalOpen: false
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
    hideModal: state => {
      state.isModalOpen = false
    },
    showModal: state => {
      state.isModalOpen = true
    }
  }
})


export const { hideSidebar, showSidebar, hideModal, showModal } = uiFeaturesSlice.actions
export default uiFeaturesSlice.reducer