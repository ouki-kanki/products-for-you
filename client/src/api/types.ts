
export interface IProductImage {
  id: number;
  image: string;
  is_featured: boolean;
}

export interface ICurrentVariation {
  variation_name: string;
  value: string;
}

export interface IVariation {
  slug: string;
  productUrl: string;
  thumb: string;
}

export interface Ipromotion {
  promotion_name: string;
  promo_price: string;
  promo_start: string;
  promo_end: string;
  is_active: boolean;
  is_scheduled: false;
  promo_reduction: 35
}

export interface IProductThumbnailorImage {
  isDefault: boolean;
  url: string
}

export interface IProduct {
  name: string;
  availability: string;
  price: string;
  features: string[];
  productImages: IProductImage[];
  current_variation: ICurrentVariation[];
  category: string[];
  description: string;
  variations: IVariation[];
  productThumbnails: IProductThumbnailorImage[];
  slug: string;
  constructedUrl: string;
  id: number;
}

export interface IproductVariationPreview {
  quantity: number;
  price: string;
  productThumbnails: IProductThumbnailorImage[];
  variationDetails: ICurrentVariation[];
  slug: string;
  constructedUrl: string;
}

// TODO: is used when fething productVariations. dry check Iproduct, I productVariationPrewiew
export interface IproductItem extends IproductVariationPreview {
  promotions: Ipromotion[];
  name: string;
}

export interface IfeaturedItem extends IproductItem {
  featured_position: number;
}

export interface FeaturedItems {
  count: number;
  next: string | null;
  numOfPages: number;
  previous: string | null;
  results: IfeaturedItem[]
}


// TODO: DRY THIS there are simiral properties
export interface IproductDetail {
  uuid: number;
  slug: string;
  name: string;
  variationName: string
  sku: string;
  price: number;
  quantity: string;
  availability: string;
  detailedDescription: string;
  features: string[];
  icon: string;
  categories: string[];
  productThumbnails: IProductThumbnailorImage[];
  productImages: IProductThumbnailorImage[];
  isFavorite?: boolean;
}

interface IorderItem {
  price: string;
  quantity: number;
  sku: string;
  slug: string;
  thumbnail: string;
}

export interface Iorder {
  orderDate: string;
  shippingAddress: string;
  billingAddress: string;
  orderTotal: string;
  orderItem: IorderItem[]
}

export interface LogoutData {
  message: string;
}
