import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom';
import styles from './notifications.module.scss'

interface INotificationProps {
  message: string;
  type: 'success' | 'caution' | 'danger'
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right',
  duration: number,
  appearFrom: 'from-top' | 'from-right' | 'from-bottom' | 'from-left'
}

export const showNotification = ({ message, position = 'bottom-right', type = 'success', duration = 1000, appearFrom = 'from-bottom' }: INotificationProps) => {
  const container = document.createElement('div')
  document.body.appendChild(container)

  ReactDOM.render(
    <div className= {
      `${styles.notification} 
       ${styles[`${position}`]} 
       ${styles[`${appearFrom}`]} 
       ${styles[`${type}`]}`}>
      {message}
    </div>, container   
  );

  setTimeout(() => {
      {/* {showNotification && <Notification message='this si nice' duration={1000}/>} */}
    document.body.removeChild(container)
  }, duration)
}