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
  const registerFields = getRegisterFields({
    hadleUserNameChange: () => {},
    handleEmailChange,
    handlePasswordChange,
    email,
    emailError,
    password,
    passwordError,
    handleInputBlur,
  })

  const handleRegister = () => {}

  // handleRegister

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
