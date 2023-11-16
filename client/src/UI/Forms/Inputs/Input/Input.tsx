import { useState } from 'react';
import { InputHTMLAttributes, forwardRef } from 'react'
import styles from './Input.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


type Ref = HTMLInputElement


// TODO: when there is an array of elements typescript cannot distinguish between the 2 different types of input and gives error about the hasLabel field. find a better way to type the input properly 
export interface IInputBase extends InputHTMLAttributes<HTMLInputElement>{
  placeholder?: string;
  value?: string;
  variant?: 'primary' | 'secondary' | 'error'
  disabled?: boolean,
  label?: string,
  hasLabel?: never,
  type?: string
}

interface IInputWithLabel extends Omit<IInputBase, 'hasLabel' | 'label'> {
  hasLabel: true,
  label: string
}

// interface IInputBase extends InputHTMLAttributes<HTMLInputElement> {
//   placeholder: string;
//   value?: string;
//   variant?: 'primary' | 'secondary' | 'error'
//   disabled: boolean;
//   hasLabel
// }

export type IInput = IInputBase | IInputWithLabel


export const Input = forwardRef<Ref, IInput>(({ placeholder, value, variant = 'primary', disabled = false, hasLabel= false, type, label, ...rest }, ref) => {
  const [isHidden, setIsHidden] = useState(true);
  // const inputStyles = `
  //   ${styles.input}
  //   ${disabled && styles[`input${disabled}`]}
  //   ${styles[`input[${variant}]`]}
  // `

  console.log(isHidden);


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
      {hasLabel && (
        <label>{label}</label>
      )}
      <div className={styles.inputContainer}>
        <input
          className={styles.input}
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
    </div>
  )
})
