import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getAccessToken } from '../features/auth/authSlice';
import { clearCredentials } from '../features/auth/authSlice';

import { userApi } from '../api';
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
      console.log("inside the cookie cleaner")
      // document.cookie = "refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      dispatch(clearCredentials())
      dispatch(userApi.util.resetApiState())
      // logOutMutAsync()
    }

    return {
      token,
      logout
    }
  }
  , [token, dispatch])
}
