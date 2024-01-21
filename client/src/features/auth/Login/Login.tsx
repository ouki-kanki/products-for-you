import { useRef, useEffect, ChangeEvent, SyntheticEvent } from 'react';
import styles from './login.module.scss';

import type { IInputBase } from '../../../UI/Forms/Inputs/Input/Input';
import { useValidation } from '../../../hooks/useValidation/useValidation';

import { Input } from '../../../UI/Forms/Inputs/Input/Input';
import { Button } from '../../../UI/Button/Button';

type Ievent = ChangeEvent<HTMLInputElement>
interface IloginInput extends Omit<IInputBase, 'id' | 'hasLabel' | 'error'> {
  id: number,
  value: string
  onChange: (e: Ievent) => void,
  onBlur: () => void,
  onFocus: () => void,
  error: string | null 
} 

import { useSelector } from 'react-redux';
import type { RootState } from '../../../app/store/store';
// AUTH IMPORTS
import { useNavigate } from 'react-router-dom';
import { setCredentials } from './loginSlice';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../../api/auth';
import type { ILoginRequest, UserResponse } from '../../../services/auth';
import { useAuth } from '../../../hooks/useAuth';

//  helpers

const getLoginFields = (handleEmailChange: (e: Ievent) => void, handlePasswordChange: (e: Ievent) => void, email: string, password: string, handleInputBlur: () => void, emailError: string | null , passwordError: string | null): Array<IloginInput> => (
  [
    {
      id: 1,
      name: 'username',
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
      name: 'password',
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

  const userId = useSelector((state: RootState) => state.auth.userId)

  // TODO: complains about missing dependency but even in the router docs they have it like this.have to check 
  useEffect(() => {
      if (userId) {
        navigate('/')
      }
  }, [userId])

  // RTK
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [login, { isLoading }] = useLoginMutation()

  // console.log(isTouched, passwordError, emailError, passwordStrength)

  const loginFields = getLoginFields(handleEmailChange, handlePasswordChange, email, password, handleInputBlur, emailError, passwordError)

  const firstInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus()
    }
  }, [])

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    
    // TODO: change the back to accept username or email? 
    // right now it accepts the userName as email.maybe change the field to email 
    const credentials: ILoginRequest = {
      username: email,
      password
    }

    try {
      const data = await login(credentials).unwrap() as UserResponse
      if (data) {
        const { token, user_id } = data;
        localStorage.setItem('token', token)
        localStorage.setItem('user_id', user_id);


        // TODO: make a util func to change keys to camelcase 
        const userData = {
          userId: user_id,
          token
        }
        dispatch(setCredentials(userData))
        navigate('/')
      }
    } catch (error) {
      console.log("the error", error)
    }
  }



  return (
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
  )
}