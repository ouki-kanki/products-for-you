import React, { SyntheticEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginRegisterForm } from './LoginRegisterForm'
import { useValidation } from '../../hooks/useValidation/useValidation'
import { getRegisterFields } from './getRegisterFields'

import { useRegisterMutation } from '../../api/authApi'
import { showNotification } from '../../components/Notifications/showNotification'
import { TimeoutId } from '@reduxjs/toolkit/dist/query/core/buildMiddleware/types'

export const Register = () => {
  const [username, setUsername] = useState('')
  const [register, {data, isLoading, isError, isSuccess, error}] = useRegisterMutation()
  const navigate = useNavigate()
  // useValidation
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
      console.log("the error", error)
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
        navigate('/login', { replace: true })
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

    const data = await register({
      email,
      password,
      password2: secondPassword,
      username
    })
    console.log("success register data", data)
  }


  return (
    <LoginRegisterForm
      title='Register'
      btnTitle='Register'
      handleSubmit={handleRegister}
      isLoading={false}
      isValid={isValid}
      fields={registerFields}
    >

    </LoginRegisterForm>
  )
}
