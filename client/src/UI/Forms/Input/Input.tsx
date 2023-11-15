import { InputHTMLAttributes, forwardRef } from 'react'
import styles from './Input.module.scss'


interface IInputBase extends InputHTMLAttributes<HTMLInputElement>{
  placeholder?: string;
  value?: string;
  variant: 'primary' | 'secondary' | 'error'
  disabled?: boolean,
  hasLabel?: boolean
}

interface IInputWithLabel extends IInputBase {
  hasLabel: true,
  label: string
}

interface IInputWithoutLabel extends IInputBase {
  hasLabel?: false;
}

type IInput = IInputWithLabel | IInputWithoutLabel

type Ref = HTMLInputElement

export const Input = forwardRef<Ref, IInput>(({ placeholder, value, variant = 'primary', disabled = false, hasLabel=false, label, ...rest }, ref) => {

  const inputStyles = `
    ${styles.input}
    ${disabled && styles[`input${disabled}`]}
    ${styles[`input[${variant}]`]}
  `

  return (
    <div className={styles.inputContainer}>
      <label>{label}</label>
      <input
        className={inputStyles}
        placeholder={placeholder}
        value={value}
        ref={ref}
        { ...rest }
      />
    </div>
  )
})
