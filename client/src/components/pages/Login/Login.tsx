import { useEffect } from 'react'
import { showSidebar, hideSidebar } from '../../../features/UiFeatures/UiFeaturesSlice'
import styles from './login.module.scss'

import { Input } from '../../../UI/Forms/Input/Input'
import { Button } from '../../../UI/Button/Button'

import { useDispatch } from 'react-redux'

interface ILoginDataField {
  label: string;
  placeholder: string;
  type?: string,
  hasLabel?: boolean; 
}

const loginData: Array<ILoginDataField> = [
  {
    label: 'email',
    placeholder: 'put your email',
  },
  {
    label: 'Password',
    placeholder: 'Enter password',
    type: 'password'
  }
]


export const Login = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(hideSidebar())

    return () => {
      dispatch(showSidebar())
    }
  }, [])

  return (
    <div className={styles.mainContainer}>
      <div className={styles.cardContainer}>
        <div className={styles.divider}></div>
        <div className={styles.leftContainer}>
          yoyo
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.formContainer}>
            <form className={styles.form}>
              <h2>Login</h2>
              <div className={styles.inputContainer}>
                <Input
                  placeholder='yo'
                  variant='primary'

                />
              </div>
              <div className={styles.inputContainer}>
                <Input
                  placeholder='yo'
                  variant='primary'              
                />
              </div>
              <div className={styles.inputContainer}>
                <Input
                  placeholder='yo'
                  variant='primary'
                  hasLabel={true}  
                  label='tototo'
                />
              </div>
              <div className={styles.inputContainer}>
                <Input
                  placeholder='yo'
                  variant='primary'              
                />
              </div>
              <div className={styles.inputContainer}>
                <Button>Login</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
