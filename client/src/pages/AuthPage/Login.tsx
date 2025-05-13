import { useEffect, SyntheticEvent } from 'react';
import { jwtDecode } from 'jwt-decode';
import { showNotification } from '../../components/Notifications/showNotification';
import { useNavigate } from 'react-router-dom';

import { setCredentials } from '../../features/auth/authSlice';
import { useLoginMutation, useLoginDemoMutation } from '../../api/authApi';
import { useDispatch } from 'react-redux';
import { useValidation } from '../../hooks/useValidation/useValidation';
import { useLocaleStorage } from '../../hooks/useLocaleStorage';
import { TimeoutId } from '@reduxjs/toolkit/dist/query/core/buildMiddleware/types';

import { getLoginFields } from './getLoginFields';
import { LoginRegisterForm } from './LoginRegisterForm';
import { Button } from '../../UI/Button/Button';

interface LoginData {
  access: string;
  refresh: string;
}

interface JwtPayload {
  username: string;
  email: string;
  uuid: string
}

type Error = {
  status: string;
  // error: string;
  data: {
    non_field_errors: string[];
    detail: string;
  }
}

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

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // RTK
  const [persist, setPersist ] = useLocaleStorage()
  const [login, { data, isLoading, isError: isLoginError, isSuccess: isLoginSuccess, error: loginError }] = useLoginMutation()
  const [demoLogin, { data: demoLoginData, isLoading: isDemoLoading, isError: isErrorDemoLogin, isSuccess: isDemoLoginSuccess, error: demoError }] = useLoginDemoMutation()
  const loginFields = getLoginFields(handleEmailChange, handlePasswordChange, email, password, handleInputBlur, emailError, passwordError)


  // TODO: have to return one type of errors from server and remove this crap
  const handleErrorNotifications = (error: Error) => {
    let message = 'something went wrong'
    if (error?.data?.non_field_errors) {
      const message = error.data.non_field_errors[0] as string

      showNotification({
        appearFrom: 'from-right',
        hideDirection: 'to-top',
        overrideDefaultHideDirection: true,
        duration: 3000,
        message,
        position: 'top-right',
        type: 'danger'
      })

    } else if (error?.data?.detail) {
      console.log("the data", error)
      message = error.data.detail

      showNotification({
        message,
        type: 'danger'
      })
    } else {
      const message = `something went wrong status: ${(error as Error).status}`
      showNotification({
        appearFrom: 'from-right',
        hideDirection: 'to-top',
        overrideDefaultHideDirection: true,
        duration: 3000,
        message,
        position: 'top-right',
        type: 'danger'
      })
    }
  }

  useEffect(() => {
    let delayId: TimeoutId;
    if (isDemoLoginSuccess) {
      showNotification({
        message: 'demo account successfully logged in'
      })
      delayId = setTimeout(() => {
        navigate('/')
      }, 600);
    }

    if (isLoginSuccess) {
      showNotification({
        message: 'Login Success.',
        appearFrom: 'from-right',
        hideDirection: 'to-bottom',
        duration: 2000,
        position: 'bottom-right',
        overrideDefaultHideDirection: true
      })

      delayId = setTimeout(() => {
        navigate('/')
      }, 600);
    } else if (isLoginError){
      console.log("the error from login", loginError)
      handleErrorNotifications(loginError)
    } else if (isErrorDemoLogin) {
      showNotification({
        message: 'could not login the demo account try again later',
        type: 'danger'
      })
    }
    return () => {
      clearTimeout(delayId)
    }

  }, [isLoginSuccess, isDemoLoginSuccess, isLoginError, isErrorDemoLogin, navigate, loginError])


  const handleDemoLogin = async (e: SyntheticEvent) => {
    e.preventDefault()

    const data = await demoLogin().unwrap() as LoginData
    const { username, email: userEmail, uuid } = jwtDecode<JwtPayload>(data.access)
    const user = username ? username : userEmail

    dispatch(setCredentials({
      user,
      userId: uuid,
      accessToken: data.access
    }))
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()

    const data = await login({ email, password }).unwrap() as LoginData
    const { username, email: userEmail, uuid } = jwtDecode<JwtPayload>(data.access)
    const user = username ? username : userEmail

    dispatch(setCredentials({
      user,
      userId: uuid,
      accessToken: data.access,
    }))
  }

  const handlePersist = () => setPersist((prev: boolean) => !prev)

  return <LoginRegisterForm
            title='Login'
            btnTitle='Login'
            handleSubmit={handleSubmit}
            handleDemoLogin={handleDemoLogin}
            fields={loginFields}
            isLoading={isLoading}
            isValid={isValid}
            mode='login'
            >
              <label htmlFor="persist">
                <input
                  type="checkbox"
                  id='persist'
                  checked={persist}
                  onChange={handlePersist}
                />
                Remember Credentials
                </label>
            </LoginRegisterForm>
}
