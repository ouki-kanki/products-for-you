import { useRef, useEffect, SyntheticEvent } from 'react';
import { jwtDecode } from 'jwt-decode';
import { showNotification } from '../../components/Notifications/showNotification';
import { useNavigate } from 'react-router-dom';

import { setCredentials } from '../../features/auth/authSlice';
import { useLoginMutation } from '../../api/authApi';
import { useDispatch } from 'react-redux';
import { useValidation } from '../../hooks/useValidation/useValidation';
import { useLocaleStorage } from '../../hooks/useLocaleStorage';
import { TimeoutId } from '@reduxjs/toolkit/dist/query/core/buildMiddleware/types';

import { getLoginFields } from './getLoginFields';
import { LoginRegisterForm } from './LoginRegisterForm';

interface LoginData {
  access: string;
  refresh: string;
}

type Error = {
  status: string;
  error: string;
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
  const [login, { data, isLoading, isError, isSuccess: isLoginSuccess, error }] = useLoginMutation()
  const loginFields = getLoginFields(handleEmailChange, handlePasswordChange, email, password, handleInputBlur, emailError, passwordError)

  useEffect(() => {

    let delayId: TimeoutId;
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
    } else if (isError) {
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
    return () => {
      clearTimeout(delayId)
    }

  }, [isLoginSuccess, isError, navigate, error])

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()

    interface JwtPayload {
      username: string;
      email: string;
      user_id: number
    }

    const data = await login({ email, password }).unwrap() as LoginData
    const { username, email: userEmail, user_id : userId } = jwtDecode<JwtPayload>(data.access)
    const user = username ? username : userEmail

    dispatch(setCredentials({
      user,
      userId,
      accessToken: data.access,
    }))
  }
  const handlePersist = () => setPersist((prev: boolean) => !prev)

  return <LoginRegisterForm
            title='Login'
            btnTitle='Login'
            handleSubmit={handleSubmit}
            fields={loginFields}
            isLoading={isLoading}
            isValid={isValid}
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
