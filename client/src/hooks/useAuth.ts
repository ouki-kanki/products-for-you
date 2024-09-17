import { useMemo, useCallback} from 'react';
import { useSelector } from 'react-redux';
import { getAccessToken } from '../features/auth/authSlice';
import { logOut } from '../features/auth/authSlice';

import { useAppDispatch } from '../hooks';
interface IReturnedObj {
  token: string | null,
  logout: () => void
}


// TODO: not USED
// *** OBSOLETE ***

// TODO: maybe return user info (id, email, token)
/**
 *
 * @returns {object} - the generated token or a null value
 * @property {string} token
 */
export const useAuth = (): IReturnedObj => {
  const token = useSelector(getAccessToken)
  const dispatch = useAppDispatch()

  return useMemo(() => {
    const logout = () => {
      dispatch(logOut())
    }

    return {
      token,
      logout
    }
  }
  , [token, dispatch])
}
