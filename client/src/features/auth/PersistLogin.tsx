import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { useRefreshMutation } from "../../api/authApi";
import { useLocaleStorage } from "../../hooks/useLocaleStorage";
import { useSelector } from "react-redux";
import { getAccessToken } from "./authSlice";

import { showNotification } from "../../components/Notifications/showNotification";

export const PersistLogin = () => {
  const [ persist ] = useLocaleStorage()
  // TODO: check the behavior if there is not an access token there is a chance that it will break because the whole objects is empty and there is no useTokens key inside

  const accessToken = useSelector(getAccessToken)
  const effectRan = useRef(false)

  const [trueSuccess, setTrueSuccess] = useState(false)
  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] = useRefreshMutation()

  useEffect((): void => {
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      const verifyRefreshToken = async () => {
        console.log("verifying refresh token")
        try {
          await refresh()
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

    // with strict mode it will 2 times . refresh should occur only the second time
    // useRef will hold the value after the component unmount and remounts
    return () => effectRan.current = true

    // eslint-disable-next-line
  }, [])

  let content;
  if (!persist || (isSuccess && trueSuccess) || (accessToken && isUninitialized)) {
    content = <Outlet/>
  } else if (isLoading) {
    content =  <p>loading</p>
  } else if (isError && persist) {
    // TODO: inform the user in certain routes
    // showNotification({
    //   message: 'please login again',
    //   appearFrom: 'from-bottom',
    //   duration: 1000,
    //   hideDirection: "to-bottom",
    //   position: 'bottom-right',
    //   overrideDefaultHideDirection: false,
    // })
    content = <Outlet/>
    // return <Link to='/login'>login</Link>
  }
  return content
}
