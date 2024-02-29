import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom';
import styles from './notifications.module.scss'

interface INotificationProps {
  message: string;
  type: 'success' | 'caution' | 'danger'
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right',
  duration: number,
  appearFrom: 'from-top' | 'from-right' | 'from-bottom' | 'from-left',
  hideDirection: 'to-top' | 'to-right' | 'to-bottom' | 'to-left',
  overrideDefaultHideDirection: boolean
}

const Notification = ({ duration, position, appearFrom, hideDirection, type, message, overrideDefaultHideDirection }) => {
  const [hideNotification, setHideNotification] = useState(false)
  
  if (!overrideDefaultHideDirection) {
    hideDirection = appearFrom.replace('from', 'to')
  }
  
  // create the class name for hiding the notification
  
  console.log("the hidedirection", hideDirection)
  
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


/**
 * hidedirection will be the same as the appearFrom direction unless overrideDefaultHideDirection is set to true
 * @param param0 
 * @returns 
 */
export const showNotification = ({ message, position = 'bottom-right', type = 'success', duration = 1000, appearFrom = 'from-bottom', hideDirection = 'to-bottom', overrideDefaultHideDirection = false }: INotificationProps) => {
  const container = document.createElement('div')
  document.body.appendChild(container)

  ReactDOM.render(<Notification message={message} position={position} type={type} duration={duration} appearFrom={appearFrom} hideDirection={hideDirection} overrideDefaultHideDirection={overrideDefaultHideDirection}/>, container   
  );

  setTimeout(() => {
    document.body.removeChild(container)
  }, duration)
}