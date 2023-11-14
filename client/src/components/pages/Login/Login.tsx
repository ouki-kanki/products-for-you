import React, { useEffect } from 'react'
import { showSidebar, hideSidebar } from '../../../features/UiFeatures/UiFeaturesSlice'

import { useDispatch } from 'react-redux'

export const Login = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(hideSidebar())

    return () => {
      dispatch(showSidebar())
      console.log("unmount login")
    }
  }, [])

  return (
    <div>Login</div>
  )
}
