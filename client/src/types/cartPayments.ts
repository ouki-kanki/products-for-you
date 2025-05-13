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
  planOptionId: string;
  cost: number;
  companyName: string;
  estimatedDeliveryTime?: string;
  taxRate: string;
}

export interface CartItemForServer {
  uuid: number;
  quantity: number;
  price: string;
}

export interface ICartItem extends CartItemForServer {
  variationName: string;
  slug: string;
  constructedUrl: string;
  productIcon: string;
  productId: string;
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
  items: CartItemForServer[]
}

export interface IShippingCosts {
  plans: Array<ShippingPlan>;
}

export interface Location {
  name: string;
  abbreviaton: string
}
