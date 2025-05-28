import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../app/store/store";
import { authApi } from "../../api/authApi";
import { sendInitCartToMiddleware } from "../cart/cartSlice";

import { useRefreshMutation } from "../../api/authApi";
import { useLocaleStorage } from "../../hooks/useLocaleStorage";
import { useSelector } from "react-redux";
import { getAccessToken } from "./authSlice";

import { Spinner } from "../../components/Spinner/Spinner";

import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { isEmpty } from "../../utils/objUtils";



export const PersistLogin = () => {
  const [ persist ] = useLocaleStorage()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const location = useLocation()
  // TODO: check the behavior if there is not an access token there is a chance that it will break because the whole objects is empty and there is no useTokens key inside

  const accessToken = useSelector(getAccessToken)
  const effectRan = useRef(false)

  const [trueSuccess, setTrueSuccess] = useState(false)
  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] = useRefreshMutation()

  // console.log("the access token", accessToken)

  useEffect((): void => {
    // this is for production where it wil not run twice
    // this is to avoid running 2 times in dev mode
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      const verifyRefreshToken = async () => {
        console.log("verifying refresh token")
        try {
          await refresh()
          dispatch(sendInitCartToMiddleware())
          setTrueSuccess(true)
        } catch (error) {
          console.log("show notification", error)
          // I want to stay in home page even if i am not logged in
          // TODO: show notification with the error
        }
      }

      if (!accessToken && persist) {
        verifyRefreshToken()
      }
    }

    // with strict mode it will run 2 times . refresh should occur only the second time
    // useRef will hold the value after the component unmount and remounts
    return () => effectRan.current = true

    // eslint-disable-next-line
  }, [])


  // effect that uses location
  // check if the access token is valid and if is not only then use the refresh token

  // useEffect(() => {
  //   //  TODO: dry this is use in the other effect
  //   const verifyRefreshToken = async () => {
  //     try {
  //       const res = await refresh()
  //       if (res?.error?.status === 401) {
  //         navigate('/login')
  //       }
  //       // NOTE: if i do not clear the cache router breaks and i have to logout manually
  //       // reset the apiState
  //       dispatch(authApi.util.resetApiState())
  //     } catch (error) {
  //       // I want to stay in home page even if i am not logged in
  //       // TODO: show notification with the error
  //     }
  //   }

  //   try {
  //     const decoded_access = jwtDecode(accessToken)
  //     if (!decoded_access || isEmpty(decoded_access as Record<string, unknown>)) {
  //       return
  //     }

  //     const exp = decoded_access.exp * 1000
  //     const now = Date.now()

  //     const humar_read_exp = new Date(exp).toLocaleString()
  //     const human_now = new Date(now).toLocaleString()


  //     if (exp < now) {
  //       verifyRefreshToken()
  //     }
  //   } catch (error) {
  //     // console.log(error)
  //   }
  // }, [location, accessToken])


  let content;
  if (!persist || (isSuccess && trueSuccess) || (accessToken && isUninitialized)) {
    content = <Outlet/>
  } else if (isLoading) {
    content =  <Spinner/>
  } else if (isError && persist) {
    content = <Outlet/>
    // return <Link to='/login'>login</Link>
  }
  return content
}
