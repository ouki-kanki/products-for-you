import { PayloadAction, createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import type { Facet } from "../../api/searchApi";

export interface ToggleFacet {
  facetName: string
  propertyName: string;
  isActive: boolean;
}

interface TransformedFacet {
  name: string;
  count: number;
  isActive: boolean
}

interface TransformedFacets {
  [key: string]: TransformedFacet[]
}

interface FilterState {
  facets: TransformedFacets;
  activeFacets: TransformedFacets;
  sideBarFieldName: string;
}

const initialState: FilterState = {
  facets: {},
  activeFacets: {},
  sideBarFieldName: ''
}

const wait = (ms: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}

//
export const asyncToggleFacet = createAsyncThunk(
  "facets/asyncToggleFacet",
  async (value: ToggleFacet, {dispatch}) => {
    dispatch(toggleFacet(value))
  }
)

export const facetSlice = createSlice({
  name: 'facets',
  initialState,
  reducers: {
    addFacets: (state, action: PayloadAction<{ facets: Facet, sideBarFieldName: string }>) => {
      const { payload: { facets, sideBarFieldName }} = action

      // TODO: fix the type
      state.facets = facets
      state.sideBarFieldName = sideBarFieldName
    },
    toggleFacet: (state, action: PayloadAction<ToggleFacet>) => {
      const { facetName, propertyName, isActive } = action.payload
      state.facets[facetName].forEach(property => {
        if (property.name === propertyName) {
          property.isActive = isActive
        }
      })
    },
    setActiveFacets: (state)  => {
      // TODO: obsolete delete
      const facets = Object.entries(state.facets).reduce((ac, [key, value]) => {
        const values = value.filter(item => item.isActive)
                             .map(item => item.name)
        return { ...ac, [key]: values }
      }, {})

      state.activeFacets = facets
    },
    clearFacet: (state, action: PayloadAction<{facetName: string}>) => {
      // TODO: to be tested
      const facets = state.facets
      facets[action.payload.facetName] = []
    },
    clearFacets: (state) => {
      state.facets = []
    }
  },
  extraReducers: (builder) => (
    builder.addCase(asyncToggleFacet.pending, (state, action) => {
      // console.log("pending")
    })
    .addCase(asyncToggleFacet.fulfilled, (state, action) => {
      // console.log("fullfiled createActiveFacets List")

      const facets = Object.entries(state.facets).reduce((ac, [key, value]) => {
        const values = value.filter(item => item.isActive)
                             .map(item => item.name)
        return { ...ac, [key]: values }
      }, {})

      state.activeFacets = facets
    })
  )
})

export const {
  addFacets,
  toggleFacet,
  setActiveFacets,
  clearFacet,
  clearFacets
} = facetSlice.actions

export default facetSlice.reducer

