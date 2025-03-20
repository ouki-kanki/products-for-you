export interface ICheckoutState {
  firstName: string;
  lastName: string;
  shippingAddress: string;
  billingAddress: string;
  phoneNumber: string;
  userEmail: string;
  city: string;
  zipCode: string;
  [key: string]: string
}

export interface ShippingPlan {
  planName: string;
  cost: number;
  companyName: string;
  estimatedDeliveryTime?: string;
}

export interface ICartItem {
  variationName: string;
  slug: string;
  constructedUrl: string;
  productIcon: string;
  productId: number;
  quantity: number;
  price: string | number;
}

export interface ICart {
  items: ICartItem[];
  total: number;
  numberOfItems: number;
  isUpdating: boolean;
  isSynced: boolean;
}

export interface IshippingData {
  city: string;
  zipCode: string;
  coutry?: string;
  items: ICartItem[]
}
