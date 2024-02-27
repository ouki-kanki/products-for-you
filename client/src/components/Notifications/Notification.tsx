import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom';
import styles from './notifications.module.scss'

interface INotificationProps {
  message: string;
  type: 'success' | 'caution' | 'danger'
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right',
  duration: number
}


export const Notification = ({ message, position = 'bottom-right', type = 'success', duration = 1000 }: INotificationProps) => {
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    setPortalContainer(container)
  }, [])

  useEffect(() => {
    const cleanup = () => {
      if (portalContainer) {
        document.body.removeChild(portalContainer)
      }
    }

    const timeoutId = setTimeout(() => {
      cleanup()
    }, duration);
    
    return () => {
      clearTimeout(timeoutId)
    }
  }, [portalContainer, duration])


  return portalContainer ? 
  ReactDOM.createPortal(
    <div className={`${styles.notification} ${styles[`${position}`]} ${styles[`${type}`]}`}>
      {message}
    </div>, portalContainer
  ) : null;
}