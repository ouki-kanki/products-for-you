import { ReactNode, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../api/authApi';
import type { RootState } from '../app/store/store';
import { useAuth } from '../hooks/useAuth';
interface ProtectedRouteProps {
  children?: ReactNode;
}

// TODO: maybe keep the user here, inform him that the page is protected and tell him to go to the login page?
export const ProtectedRoute: React.FC<ProtectedRouteProps> = () => {
  const token = useSelector((state: RootState) => state.auth.userTokens.accessToken)
  const location = useLocation()
  // TODO: if the token is expired try to refresh the token.
  //  *** this is byggy ***
  // for now if the user is in protected route and the access is exprired logout the user
  const tokenStr = JSON.stringify(token)

  useEffect(() => {
    if (!tokenStr) {
      return
    }
  }, [location.key])

  return (
    token
      ? <Outlet />
      : <Navigate to='/login' state={{ from: location }} replace/>
  )
}
