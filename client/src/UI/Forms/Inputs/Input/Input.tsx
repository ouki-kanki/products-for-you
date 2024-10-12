import { useState } from 'react';
import { InputHTMLAttributes, forwardRef } from 'react'
import styles from './Input.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


type Ref = HTMLInputElement


// TODO: when File | null is added no is does not extends properly
// TODO: when there is an array of elements typescript cannot distinguish between the 2 different types of input and gives error about the hasLabel field. find a better way to type the input properly
export interface IInputBase extends InputHTMLAttributes<HTMLInputElement>{
  placeholder?: string;
  value?: string | File | null;
  variant?: 'primary' | 'secondary' | 'error';
  disabled?: boolean;
  label?: string;
  type?: string;
  error?: string | null
}

  // hasLabel: never;
// interface IInputWithLabel extends Omit<IInputBase, 'hasLabel' | 'label'> {
//   label: string
// }

// export type IInput = IInputBase | IInputWithLabel

/**
 * accepts
 * placeholder optional
 * value optional
 * variant - primary, secondary, error
 * disabled - boolean
 * label string
 * type string
 * error string | null
 */
export const Input = forwardRef<Ref, IInputBase>(({ placeholder, value, variant = 'primary', name, type, label, error, ...rest }, ref) => {
  const [isHidden, setIsHidden] = useState(true);

  // TODO: find a more elegand way
  /**
   * in situations where the type is not password i want the correct type to return and not 'text' that's why a whole handler is used
   * @returns
   */
  const handleType = (type: string) => {
    if (type !== 'password') {
      return type
    } else if(type === 'password' && isHidden) {
      return type
    } else {
      return 'text'
    }
  }

  return (
    <div className={styles.inputWithLabel}>
      {label && (
        <label htmlFor={name}>{label}</label>
      )}
      <div className={styles.inputContainer}>
        <input
          name={name}
          className={`${styles.input} ${error && styles.error}`}
          placeholder={placeholder}
          // 1 - password & hidden -> type .
          type={handleType(type as string)}
          value={value}
          ref={ref}
          { ...rest }
        />
        {type === 'password' && (
          <FontAwesomeIcon
            onClick={() => setIsHidden((prevState) => !prevState)}
            className={styles.icon}
            icon={isHidden ? faEyeSlash : faEye}
            size='1x'/>
          )
        }
      </div>
      {error && (
        <div className={styles.errorMessage}>{error}</div>
      )}
    </div>
  )
})
