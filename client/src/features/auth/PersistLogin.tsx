import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { useRefreshMutation } from "./authApiSlice";
import { useLocaleStorage } from "../../hooks/useLocaleStorage";
import { useSelector } from "react-redux";
import { getAccessToken } from "./authSlice";
import { getRefreshToken } from "./authSlice";


export const PersistLogin = () => {
  const [ persist ] = useLocaleStorage()
  // TODO: check the behavior if there is not an access token there is a chance that it will break because the whole objects is empty and there is no useTokens key inside
  const accessToken = useSelector(getAccessToken)
  const refreshToken = useSelector(getRefreshToken)
  const effectRan = useRef(false)

  const [trueSuccess, setTrueSuccess] = useState(false)
  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] = useRefreshMutation()

  useEffect((): void => {
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      const verifyRefreshToken = async (refreshToken: string) => {
        console.log("verifying refresh token")
        try {
          await refresh(refreshToken)
          setTrueSuccess(true)
        } catch (error) {
          console.log("show notification", error)
          // TODO: show notification with the error
        }
      }

      if (!accessToken && persist) {
        verifyRefreshToken(refreshToken)
      }
    }

    // with strict mode it will 2 times . refresh should occur only the second time
    // useRef will hold the value after the component unmount and remounts
    return () => effectRan.current = true

    // eslint-disable-next-line
  }, [])

  return (
    <div>PersistLogin</div>
  )
}
