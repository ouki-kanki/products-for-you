import { useState } from "react"
import styles from './notificationV2.module.scss'


type HideDirection = 'to-top' | 'to-right' | 'to-bottom' | 'to-left'

export interface NotificationProps {
  message: string;
  type?: 'success' | 'caution' | 'danger'
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right',
  duration?: number,
  appearFrom?: 'from-top' | 'from-right' | 'from-bottom' | 'from-left',
  hideDirection?: HideDirection
  overrideDefaultHideDirection?: boolean
}


export const NotificationV2 = ({ duration, position, appearFrom, hideDirection, type, message, overrideDefaultHideDirection }: NotificationProps) => {
  const [hideNotification, setHideNotification] = useState(false)

  return (
    <div className= {
      `${styles.notification}
      ${styles[`${position}`]}
      ${hideNotification ? '' : styles[`${appearFrom}`]}
      ${hideNotification && styles[`${hideDirection}`]}
      ${styles[`${type}`]}`}
      >
      {message}
    </div>
  )
}
