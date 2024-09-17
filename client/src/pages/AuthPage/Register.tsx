import React from 'react'
import { LoginRegisterForm } from './LoginRegisterForm'
import { useValidation } from '../../hooks/useValidation/useValidation'
import { getRegisterFields } from './getRegisterFields'



export const Register = () => {

  // useValidation
  const {
    email,
    emailError,
    password,
    passwordError,
    handleEmailChange,
    handlePasswordChange,
    handleInputBlur,
    isValid
  } = useValidation()

  // getRegisterFields
  const registerFields = getRegisterFields(
    handleEmailChange,
    handlePasswordChange,
    email,
    password,
    handleInputBlur,
    emailError,
    passwordError
  )

  const handleRegister = () => {}

  // handleRegister

  return (
    <LoginRegisterForm
      title='Register'
      handleSubmit={handleRegister}
      isLoading={false}
      isValid={isValid}
      fields={registerFields}
    >

    </LoginRegisterForm>
  )
}
