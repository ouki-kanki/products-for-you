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
  const navigate = useNavigate()
  const { runCaptcha, isBot, setIsBot } = useRecaptcha()

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

  const uid = data?.uid
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
        navigate(`/activation-pending/${uid}`, { replace: false })
      }, 1600)
    }
    return () => clearTimeout(timeoutid)
  }, [isError, error, isSuccess, navigate, uid])

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
    const recaptchaToken =  await runCaptcha('signup')

    if (!recaptchaToken) {
      setIsBot(true)
      return
    }

    await register({
      email,
      password,
      password2: secondPassword,
      username,
      recaptchaToken
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
