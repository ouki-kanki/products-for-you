import { useRef, useEffect, ChangeEvent, SyntheticEvent } from 'react';
import styles from './login.module.scss'

import type { IInputBase } from '../../../UI/Forms/Inputs/Input/Input';
import { useValidation } from '../../../hooks/useValidation/useValidation';


import { WithoutSidebar } from '../../../hocs/WithoutSidebar'

import { Input } from '../../../UI/Forms/Inputs'
import { Button } from '../../../UI/Button/Button'


//  types

type Ievent = ChangeEvent<HTMLInputElement>

interface IloginInput extends Omit<IInputBase, 'id' | 'hasLabel' | 'error'> {
  id: number,
  value: string
  onChange: (e: Ievent) => void,
  onBlur: () => void,
  onFocus: () => void,
  error: string | null 
} 


//  helpers

const getLoginFields = (handleEmailChange: (e: Ievent) => void, handlePasswordChange: (e: Ievent) => void, email: string, password: string, handleInputBlur: () => void, emailError: string | null , passwordError: string | null): Array<IloginInput> => (
  [
    {
      id: 1,
      label: 'Email',
      value: email,
      placeholder: '',
      onChange: handleEmailChange,
      onBlur: handleInputBlur,
      onFocus: handleInputBlur,
      error: emailError
    },
    {
      id: 2,
      label: 'Password',
      value: password,
      placeholder: 'Enter password',
      type: 'password',
      onChange: handlePasswordChange,
      onBlur: handleInputBlur,
      onFocus: handleInputBlur,
      error: passwordError,
    }
  ]
)

//  ** MAIN COMPONENT ** 

export const Login = () => {
  const {
    email,
    emailError,
    password,
    passwordError,
    passwordStrength,
    handleEmailChange,
    handlePasswordChange,
    handleInputBlur,
    isValid
  } = useValidation();

  // console.log(isTouched, passwordError, emailError, passwordStrength)

  const loginFields = getLoginFields(handleEmailChange, handlePasswordChange, email, password, handleInputBlur, emailError, passwordError)

  const firstInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus()
    }
  }, [])

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
  }

  return (
    <WithoutSidebar>
      <div className={styles.mainContainer}>
        <div className={styles.cardContainer}>
          <div className={styles.divider}></div>
          <div className={styles.leftContainer}>
            yoyo
          </div>
          <div className={styles.rightContainer}>
            <div className={styles.formContainer}>
              <form className={styles.form} onSubmit={handleSubmit}>
                <h2>Login</h2>
                {loginFields.map(({ id, ...rest }) => (
                  <div className={styles.inputContainer} key={id}>
                    <Input
                      ref= {id === 1 ? firstInputRef : null}
                      {...rest}
                    />
                  </div>
                ))}
                <div className={styles.inputContainer}>
                  <Button 
                    type='submit'
                    disabled={!isValid}
                    >Login</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </WithoutSidebar>
  )
}
