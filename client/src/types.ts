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

export interface IProduct {
  title: string;
  description: string;
  price: number;
  img: string;
  rating: number;
  amount: number;
  color: string[];
}

// ** NUMBER RANGE ** 
export type Ran<T extends number> = number extends T ? number :_Range<T, []>;
type _Range<T extends number, R extends unknown[]> = R['length'] extends T ? R[number] : _Range<T, [R['length'], ...R]>;

