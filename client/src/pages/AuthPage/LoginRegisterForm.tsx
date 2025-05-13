import React, { SyntheticEvent, useRef, useEffect } from 'react'
import { WithoutSidebar } from '../../hocs/WithoutSidebar';
import styles from './loginregisterForm.module.scss'

import { Input } from '../../UI/Forms/Inputs/Input/Input';
import { Button } from '../../UI/Button/Button';

import type { IloginInput } from './getLoginFields';

interface FormProps {
  handleSubmit: (e: SyntheticEvent) => void;
  handleDemoLogin: (e: SyntheticEvent) => void;
  fields: IloginInput[];
  isValid: boolean;
  isLoading: boolean;
  title: string;
  btnTitle: string;
  mode: 'register' | 'login',
  children: React.ReactNode
}

export const LoginRegisterForm = ({
  handleSubmit,
  handleDemoLogin,
  fields,
  isValid, isLoading, title, btnTitle, mode, children}: FormProps) => {

    const firstInputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
      if (firstInputRef.current) {
        firstInputRef.current.focus()
      }
    }, [])

    return (
      <WithoutSidebar>
        <div className={`${styles.mainContainer}`}>
          <div className={styles.cardContainer}>
            <div className={styles.divider}></div>
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
                    {children}
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
