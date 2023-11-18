import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react'
import styles from './button.module.scss'


interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 's' | 'm' | 'l' | 'xl';
  children: ReactNode | string;
  type?: 'submit' | 'button' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  shape?: 'square' | 'rounded';
  disabled?: boolean
}

type Ref = HTMLButtonElement;


export const Button = forwardRef<Ref, IButton>(({ size = 'm', children, type = 'button', variant = 'primary', shape = 'square', disabled = false, ...rest }, ref) => {

  const buttonProps = `
    ${styles.buttonContainer} 
    ${styles[`buttonContainer${size}`]} 
    ${styles[`buttonContainer${variant}`]} 
    ${styles[`buttonContainer${shape}`]}
  `


  return (
    <button
      className={`${buttonProps} ${disabled && styles.disabled}`}
      type={type}
      ref={ref}
      disabled={disabled}
      { ...rest } >{children}</button>
  )
})
