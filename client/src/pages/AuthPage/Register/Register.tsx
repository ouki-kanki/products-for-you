import React, { SyntheticEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecaptcha } from '../../../hooks/useRecaptcha'

import { LoginRegisterForm } from '../LoginRegisterForm'
import { useValidation } from '../../../hooks/useValidation/useValidation'
import { getRegisterFields } from '../getRegisterFields'

import { useRegisterMutation } from '../../../api/authApi'
import { showNotification } from '../../../components/Notifications/showNotification'
import { TimeoutId } from '@reduxjs/toolkit/dist/query/core/buildMiddleware/types'
import { BotBanner } from '../../../components/Banners/BotBanner/BotBanner'

export const Register = () => {
  const [username, setUsername] = useState('')
  const [register, {data, isLoading, isError, isSuccess, error}] = useRegisterMutation()
  const [isBot, setIsBot ] = useState(true)
  const navigate = useNavigate()
  const { runCaptcha } = useRecaptcha()

  const {
    email,
    emailError,
    password,
    handlePasswordChange,
    passwordError,
    secondPassword,
    handleSecondPasswordChange,
    secondPasswordError,
    handleEmailChange,
    handleInputBlur,
    isValid
  } = useValidation('register')

  const handleUserNameChange = ({ target: { value }}: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(value)
  }

  useEffect(() => {
    let timeoutid: TimeoutId;
    if (isError) {
      // TODO: check the type
      const { data } = error
      let errorMessage = 'something went wrong'
      if (data.email) {
        errorMessage = data.email.join('')
      }
      if (data.password) {
        // console.log("password error")
      }

      // TODO: handle notification async
      showNotification({
        appearFrom: 'from-top',
        duration: 2400,
        hideDirection: 'to-right',
        overrideDefaultHideDirection: true,
        message: errorMessage,
        position: 'top-right',
        type: 'danger'
      })
    }

    if (isSuccess) {
      showNotification({
        appearFrom: 'from-top',
        duration: 1500,
        hideDirection: 'to-top',
        message: 'User Registered successfully',
        position: 'top-right',
      })

      timeoutid = setTimeout(() => {
        navigate(`/activate/${data.uid}`, { replace: false })
      }, 1600)
    }
    return () => clearTimeout(timeoutid)
  }, [isError, error, isSuccess, navigate])

  // getRegisterFields
  const registerFields = getRegisterFields({
    username,
    handleUserNameChange,
    handleEmailChange,
    password,
    handlePasswordChange,
    secondPassword,
    handleSecondPasswordChange,
    secondPasswordError,
    email,
    emailError,
    passwordError,
    handleInputBlur,
  })

  const handleRegister = async (e: SyntheticEvent) => {
    e.preventDefault()
    const token =  await runCaptcha('signup')

    if (!token) {
      setIsBot(true)
      return
    }

    await register({
      email,
      password,
      password2: secondPassword,
      username
    })
  }

  if (isBot) {
    return <BotBanner/>

  }

  return (
      <LoginRegisterForm
        title='Register'
        btnTitle='Register'
        handleSubmit={handleRegister}
        isLoading={isLoading}
        isValid={isValid}
        fields={registerFields}
      />
  )
}
