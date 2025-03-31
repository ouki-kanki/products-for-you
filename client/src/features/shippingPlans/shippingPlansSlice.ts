// *** NOT USED ***
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface ShippingPlan {
  companyName: string;
  cost: number;
  estimatedDeliveryTime: string;
  planOptionId: string;
}

interface InitialState {
  plans: ShippingPlan[]
}


const initialState: InitialState = {
  plans: []
}

export const shippingPlanSlice = createSlice({
  name: 'shippingPlans',
  initialState,
  reducers: {
    setPlans: (state, action: PayloadAction<ShippingPlan[]>) => {
      state.plans = action.payload
    },
    clearPlans: (state) => { state.plans = []}
  }
})
