import { useRef, useEffect, SyntheticEvent } from 'react';
import styles from './login.module.scss';
import { jwtDecode } from 'jwt-decode';

import { WithoutSidebar } from '../../hocs/WithoutSidebar';
import { showNotification } from '../../components/Notifications/showNotification';
import { Input } from '../../UI/Forms/Inputs/Input/Input';
import { Button } from '../../UI/Button/Button';
import { getLoginFields } from './getLoginFields';

import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../../features/auth/authSlice';
import { useLoginMutation } from '../../features/auth/authApiSlice';
import { useDispatch } from 'react-redux';
import { useValidation } from '../../hooks/useValidation/useValidation';
import { useLocaleStorage } from '../../hooks/useLocaleStorage';

import type { LoginCreds } from '../../features/auth/authApiSlice';


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
  const firstInputRef = useRef<HTMLInputElement | null>(null)

  // RTK
  const [persist, setPersist ] = useLocaleStorage()
  const [login, { data, isLoading, isError, isSuccess: isLoginSuccess, error }] = useLoginMutation()
  const loginFields = getLoginFields(handleEmailChange, handlePasswordChange, email, password, handleInputBlur, emailError, passwordError)

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus()
    }

    let delayId: number;
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

  const handlePersist = () => setPersist((prev: boolean) => !prev)
  const handleSubmitV2 = async (e: SyntheticEvent) => {
    e.preventDefault()

    const data = await login({ email, password }).unwrap() as LoginData

    console.log("the data", jwtDecode(data.access))
    const { username, email: userEmail, user_id : userId } = jwtDecode(data.access)
    const user = username ? username : userEmail

    dispatch(setCredentials({
      user,
      userId,
      accessToken: data.access,
      refreshToken: data.refresh
    }))
  }

  return (
    <WithoutSidebar>
      <div className={styles.mainContainer}>
        <div className={styles.cardContainer}>
          <div className={styles.divider}></div>
          <div className={styles.leftContainer}>
          </div>
          <div className={styles.rightContainer}>
            <div className={styles.formContainer}>
              <form className={styles.form} onSubmit={handleSubmitV2}>
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
                  <div>
                  <Button type='submit' disabled={!isValid}>
                    {isLoading ? 'Loading...' : 'Login V2'}
                  </Button>
                  <label htmlFor="persist">
                    <input
                      type="checkbox"
                      id='persist'
                      onChange={handlePersist}
                    />
                    Remember Credentials
                    </label>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </WithoutSidebar>
  )
}
