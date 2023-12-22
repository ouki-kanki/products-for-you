import { useMemo, useCallback} from 'react';
import { useSelector } from 'react-redux';
import { selectToken } from '../features/auth/Login/loginSlice';
import { logOut } from '../features/auth/Login/loginSlice';
import { useAppDispatch } from '../hooks';
interface IReturnedObj {
  token: string | null,
  logout: () => void
}

// TODO: maybe return user info (id, email, token)
/**
 * 
 * @returns {object} - the generated token or a null value
 * @property {string} token 
 */
export const useAuth = (): IReturnedObj => {
  const token = useSelector(selectToken)
  const dispatch = useAppDispatch()

  return useMemo(() => {
    const logout = () => {
      dispatch(logOut())
      localStorage.setItem('token', '')
    }

    return {
      token,
      logout
    }
  }
  , [token, dispatch])
}