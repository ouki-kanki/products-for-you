import { useEffect, useState } from "react"
import styles from './notifications.module.scss'


type HideDirection = 'to-top' | 'to-right' | 'to-bottom' | 'to-left'

export interface NotificationProps {
  message: string;
  type?: 'success' | 'caution' | 'danger'
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right',
  duration: number,
  appearFrom: 'from-top' | 'from-right' | 'from-bottom' | 'from-left',
  hideDirection: HideDirection
  overrideDefaultHideDirection?: boolean
}


export const _Notification = ({ duration, position, appearFrom, hideDirection, type, message, overrideDefaultHideDirection }: NotificationProps) => {
  const [hideNotification, setHideNotification] = useState(false)

  if (!overrideDefaultHideDirection) {
    // create the class name for hiding the notification
    hideDirection = appearFrom.replace('from', 'to') as HideDirection
  }

  useEffect(() => {
    const id = setTimeout(() => {
      setHideNotification(true)
    }, duration - 500)

    return () => {
      clearTimeout(id)
    }
  }, [duration])

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
