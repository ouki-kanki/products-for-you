import { InputHTMLAttributes, forwardRef } from 'react'
import styles from './Input.module.scss'


interface IInput extends InputHTMLAttributes<HTMLInputElement>{
  placeholder?: string;
  value: string;
  variant: 'primary' | 'secondary' | 'error'
  disabled: boolean,
}

export type Ref = HTMLInputElement

export const Input = forwardRef<Ref, IInput>(({ placeholder, value, variant = 'primary', disabled = false, ...rest }, ref) => {

  const inputStyles = `
    ${styles.input}
    ${disabled && styles[`input${disabled}`]}
    ${styles[`input[${variant}]`]}
  `

  return (
    <input
      className={inputStyles}
      placeholder={placeholder}
      value={value}
      ref={ref}
      { ...rest }
    />
  )
})
