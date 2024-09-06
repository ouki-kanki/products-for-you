import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { Facets, Facet } from "../../api/searchApi";


export interface ToggleFacet {
  name: string;
  isActive: boolean;
}


interface FilterState {
  facets: Facet;
  sideBarFieldName: string;
}

const initialState: FilterState = {
  facets: {},
  sideBarFieldName: ''
}

export const facetSlice = createSlice({
  name: 'facets',
  initialState,
  reducers: {
    addFacets: (state, action: PayloadAction<{ facets: Facet, sideBarFieldName: string }>) => {
      const { payload: { facets, sideBarFieldName }} = action

      state.facets = facets
      state.sideBarFieldName = sideBarFieldName
    },
    toggleFacet: (state, action: PayloadAction<ToggleFacet>) => {
      const { name, isActive } = action.payload
      const targetFacet = state.facets.find(facet => facet.name === name)
      if (targetFacet) {
        targetFacet.isSelected = isActive
      }
    },
    clearFacets: (state) => {
      state.facets = []
    }
  }
})


// optional?
// addfacet
// removefacet

export const {
  addFacets,
  toggleFacet,
  clearFacets
} = facetSlice.actions

export default facetSlice.reducer

