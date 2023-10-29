// redux

export interface IServerError {
  statusCode: number,
  description: string,
  message?: string | Error
}

export interface IPayload<T> {
  data: Array<T>,
  status: 'idle' | 'success' | 'error' | 'pending',
  error: IServerError | string | unknown
}

