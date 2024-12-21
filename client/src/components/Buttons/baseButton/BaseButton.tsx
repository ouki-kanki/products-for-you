import { PropsWithChildren } from 'react'
import styles from './baseButton.module.scss'

interface ButtonProps {
  size?: 'sm' | 'md' | 'lg';
}


// TODO: add some methods to change the color and size with the provided props
export const BaseButton = ({ children, size = 'md' }: PropsWithChildren<ButtonProps>) => {


  //TODO: add sizes

  return (
    <div className={`${styles.button} ${styles[`${size}`]}`}>{children}</div>
  )
}
