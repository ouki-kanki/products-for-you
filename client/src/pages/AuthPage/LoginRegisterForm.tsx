import { SyntheticEvent, useRef, useEffect } from 'react'
import { WithoutSidebar } from '../../hocs/WithoutSidebar/WithoutSidebar';
import styles from './loginregisterForm.module.scss'

import { Input } from '../../UI/Forms/Inputs/Input/Input';
import { Button } from '../../UI/Button/Button';

import type { IloginInput } from './getLoginFields';

interface FormProps {
  handleSubmit: (e: SyntheticEvent) => void;
  handleDemoLogin: (e: SyntheticEvent) => void;
  handlePersist: () => void;
  handleSignUp: () => void;
  persist: boolean;
  fields: IloginInput[];
  isValid: boolean;
  isLoading: boolean;
  title: string;
  btnTitle: string;
  mode: 'register' | 'login',
}

export const LoginRegisterForm = ({
  handleSubmit,
  handleDemoLogin,
  fields,
  isValid,
  isLoading,
  title,
  btnTitle,
  mode,
  handlePersist,
  persist,
  handleSignUp
}: FormProps) => {
    const firstInputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
      if (firstInputRef.current) {
        firstInputRef.current.focus()
      }
    }, [])

    return (
      <WithoutSidebar>
        <div className={styles.container}>
          <div className={styles.cardContainer}>
            {/* <div className={styles.divider}></div> */}
            <div className={styles.leftContainer}>
            </div>
            <div className={styles.rightContainer}>
              <div className={styles.formContainer}>

                <form className={styles.form} onSubmit={handleSubmit}>
                  <h2>{title}</h2>
                  {fields.map(({ id, ...rest }) => (
                    <div className={styles.inputContainer} key={id}>
                      <Input
                        ref= {id === 1 ? firstInputRef : null}
                        {...rest}
                      />
                    </div>
                  ))}
                  <div className={styles.inputContainer}>
                    <div>
                      <div className={styles.btnContainer}>
                        <Button type='submit' disabled={!isValid || isLoading}>
                          {isLoading ? 'Loading...' : `${btnTitle}`}
                        </Button>
                        {mode === 'login' && (
                            <Button onClick={handleDemoLogin}>Demo Account</Button>
                          )
                        }
                      </div>

                      <label htmlFor="persist">
                        <input
                          type="checkbox"
                          id='persist'
                          checked={persist}
                          onChange={handlePersist}
                        />
                        Remember Credentials
                      </label>
                      <a
                        className={styles.signUp}
                        onClick={handleSignUp}>Sign Up</a>
                    </div>
                  </div>
                </form>
              </div>
            </div>

          {/* card -container end */}
          </div>
        </div>
      </WithoutSidebar>
  )
}
