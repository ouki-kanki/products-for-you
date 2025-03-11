import { Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../app/store/store";
import { sendInitCartToMiddleware } from "../cart/cartSlice";

import { useRefreshMutation } from "../../api/authApi";
import { useLocaleStorage } from "../../hooks/useLocaleStorage";
import { useSelector } from "react-redux";
import { getAccessToken } from "./authSlice";

import { Spinner } from "../../components/Spinner/Spinner";

export const PersistLogin = () => {
  const [ persist ] = useLocaleStorage()
  const dispatch = useAppDispatch()
  // TODO: check the behavior if there is not an access token there is a chance that it will break because the whole objects is empty and there is no useTokens key inside

  const accessToken = useSelector(getAccessToken)
  const effectRan = useRef(false)

  const [trueSuccess, setTrueSuccess] = useState(false)
  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] = useRefreshMutation()

  useEffect((): void => {
    // this is for production where it wil not run twice
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
