import { ReactNode, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useRefreshMutation, useLogoutMutation } from '../api/authApi';


import type { RootState } from '../app/store/store';
import { jwtDecode } from 'jwt-decode';
import { isEmpty } from '../utils/objUtils';
import { useAuth } from '../hooks/useAuth';
interface ProtectedRouteProps {
  children?: ReactNode;
}


// TODO: maybe keep the user here, inform him that the page is protected and tell him to go to the login page?
export const ProtectedRoute: React.FC<ProtectedRouteProps> = () => {
  const token = useSelector((state: RootState) => state.auth.userTokens.accessToken)
  const location = useLocation()
  const navigate = useNavigate()
  // const [ refresh, { data }] = useRefreshMutation()
  const { logout } = useAuth()
  const [logOutMut ] = useLogoutMutation()
  // TODO: if the token is expired try to refresh the token.
  //  *** this is byggy ***
  // for now if the user is in protected route and the access is exprired logout the user

  const tokenStr = JSON.stringify(token)

  console.log("PROTECTED ROUTE")

  useEffect(() => {
    if (!tokenStr) {
      return
    }
    // check the token validity


  }, [location.key])

  // useEffect(() => {
  //   if (! tokenStr) {
  //     return
  //   }

  //   const logoutUser = async () => {
  //     console.log("INSIDE THE PROT")
  //     logout()
  //     const data = await logOutMut().unwrap()

  //     navigate('/login')
  //   }

  //   const token = JSON.parse(tokenStr)

  //   const now = Date.now()
  //   const decodedToken = jwtDecode(token)
  //   const expInMil = decodedToken.exp * 1000
  //   // console.log(expInMil)
  //   // console.log("now", now)
  //   // console.log(expInMil < now)

  //   if (expInMil < now) {
  //     console.log("token expired")
  //     logoutUser()
  //   }

  // }, [location.key, tokenStr, navigate, logOutMut])


  // useEffect(() => {
  //   const decoded_access = jwtDecode(token)
  //   const now = Date.now()
  //   const exp = decoded_access.exp * 1000


  //   // if the token is expired try to refresh
  //   if (!isEmpty(decoded_access) && (exp < now)) {
  //     console.log("the access isnide protected", decoded_access)
  //     reFresh()
  //   }

  //   console.log("inside the effect of the profile")
  // }, [refresh])
  // if there is no access nagitate to login

  // if the access is exprired try to refresh


  return (
    token
      ? <Outlet />
      : <Navigate to='/login' state={{ from: location }} replace/>
  )
}
