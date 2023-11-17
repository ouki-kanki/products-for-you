import { useRef, useEffect, useState } from 'react';
import styles from './login.module.scss'

import type { IInput, IInputBase } from '../../../UI/Forms/Inputs/Input/Input';

import { WithoutSidebar } from '../../../hocs/WithoutSidebar'

import { Input } from '../../../UI/Forms/Inputs'
import { Button } from '../../../UI/Button/Button'



interface IloginInput extends Omit<IInputBase, 'id' | 'hasLabel'> {
  id: number,
  hasLabel: boolean
} 


const loginFields: Array<IloginInput> = [
  // TODO : when there is a field label make it so there is no use for the flag 'hasLabel'
  {
    id: 1,
    label: 'Email',
    placeholder: '',
    hasLabel: true,
  },
  {
    id: 2,
    label: 'Password',
    placeholder: 'Enter password',
    type: 'password',
    hasLabel: true,
  }
]


export const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })

  const firstInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus()
    }
  })

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
              <form className={styles.form}>
                <h2>Login</h2>
                {loginFields.map(({ placeholder, label, hasLabel, type, id }) => (
                  <div className={styles.inputContainer} key={id}>
                    {hasLabel ?
                    (
                      <Input
                        ref= {id === 1 ? firstInputRef : null}
                        placeholder={placeholder}
                        hasLabel={hasLabel}
                        label={label as string}
                        type={type}
                        variant='primary'
                      />
                      ) :
                      <Input
                        ref= {id === 1 ? firstInputRef : null}
                        placeholder={placeholder}
                        label={label as string}
                        type={type}
                        variant='primary'
                      />
                    }
                  </div>
                ))}
                <div className={styles.inputContainer}>
                  <Button>Login</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </WithoutSidebar>
  )
}
