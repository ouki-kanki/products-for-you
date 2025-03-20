import { PropsWithChildren } from 'react'
import styles from './baseButton.module.scss'
import { useClassLister } from '../../../hooks/useClassLister';

interface StyleProps {

}

interface ButtonProps {
  size?: 'sm' | 'md' | 'lg';
  btn_type?: 'success' | 'caution' | 'danger';
  color?: 'primary' | 'secondary';
  onClick: React.MouseEventHandler<HTMLButtonElement>
  rounded?: boolean;
  isLoading?: boolean;
  type?: "button" | "submit" | "reset"
}


// TODO: add some methods to change the color and size with the provided props
export const BaseButton = ({ children, size = 'md',
                             type,
                             onClick,
                             rounded,
                             btn_type,
                             color='primary',
                             isLoading
                             }: PropsWithChildren<ButtonProps>) => {
  const classes = useClassLister(styles)

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={classes('button', `${btn_type && btn_type}`, `${size}`, `${rounded && 'rounded'}`, `${color}`)}
      >{isLoading ?
      <div className={styles.loader}></div>  :
      <div className={styles.children}>{children}</div>}</button>
  )
}
