import { ReactNode } from 'react'
// redux

export interface IServerError {
  statusCode: number,
  description: string,
  message?: string | Error
}

export interface IServerErrorV2 {
  status: number,
  data: Record<string, unknown>
}

export interface IPayload<T> {
  data: Array<T>,
  status: 'idle' | 'success' | 'error' | 'pending',
  error: IServerError | string | unknown
}


// Data from server
export interface Iproduct {
  brand: string;
  category: Array<string>;
  description: string;
  features: Array<string>;
  icon: string;
  id: number;
  listofVariations: Record<string, string | number>
  name: string;
  price: string;
  productThumbnails: Array<IThumbnail>;
  quantity: number
  variations: Array<IVariation>
}


// ** NUMBER RANGE **
export type Ran<T extends number> = number extends T ? number :_Range<T, []>;
type _Range<T extends number, R extends unknown[]> = R['length'] extends T ? R[number] : _Range<T, [R['length'], ...R]>;

export type ICredentials = {
  userId: number | string | null,
  token: string | null
}

// react - general

export interface IChildren {
  children: ReactNode
}

export interface IUiConfig {
  isSidebarHidden: boolean | string | null
}

export interface ICategory {
  id: number;
  name: string;
  slug: string
  icon: string;
  children: ICategory[],
  my_parent_category: string | null
}
