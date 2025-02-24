
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
  quantity: number;
  price: string;
  features: string[];
  product_images: IProductImage[];
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


// TODO: DRY THIS there are simiral properties
export interface IproductDetail {
  id: number;
  slug: string;
  name: string;
  variationName: string
  sku: string;
  price: number;
  quantity: string;
  detailedDescription: string;
  features: string[];
  icon: string;
  categories: string[];
  productThumbnails: IProductThumbnailorImage[];
  productImages: IProductThumbnailorImage[];
  isFavorite?: boolean;
}

