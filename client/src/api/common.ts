import { AuthEnum } from './enums';
import type { RootState } from '../app/store/store';

// *** OBSOLETE ***
export const prepareHeaders =  (headers: Headers, { getState }: { getState: () => unknown }) => {
  const token = (getState() as RootState).auth.userTokens.accessToken
  if (token) {
    headers.set(AuthEnum.authorization, `Bearer ${token}`)
  }
  return headers
}
