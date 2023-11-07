import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react'
import styles from './button.module.scss'


interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 's' | 'm' | 'l' | 'xl';
  children: ReactNode | string;
  type?: 'submit' | 'button' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  shape?: 'square' | 'rounded'
}

type Ref = HTMLButtonElement;


export const Button = forwardRef<Ref, IButton>(({ size = 'm', children, type = 'button', variant = 'primary', shape = 'square', ...rest }, ref) => {

  const buttonProps = `
    ${styles.buttonContainer} 
    ${styles[`buttonContainer${size}`]} 
    ${styles[`buttonContainer${variant}`]} 
    ${styles[`buttonContainer${shape}`]}
  `


  return (
    <button
      className={buttonProps}
      type={type}
      ref={ref}
      { ...rest } >{children}</button>
  )
})
