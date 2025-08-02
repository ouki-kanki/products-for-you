import { useState, useRef, useEffect } from 'react'
import styles from './toolTip.module.scss'

interface IToolTipProps {
  children: React.ReactNode;
  showDelay?: number;
  hideDelay?: number;
  position?: 'top-right' | 'bottom-right';
  message: string;
}

export const ToolTip = ({ children, showDelay=100, hideDelay=200, position='top-right', message }: IToolTipProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const showTimeout = useRef<NodeJS.Timeout | null>(null)
  const hideTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (showTimeout.current) clearTimeout(showTimeout.current)
      if (hideTimeout.current) clearTimeout(hideTimeout.current)
    }
  }, [])


  const showToolTip = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current)
    }
    showTimeout.current = setTimeout(() => {
      setIsVisible(true)
    }, showDelay)
  }

  const hideToolTip = () => {
      if (showTimeout.current) {
        clearTimeout(showTimeout.current)
      }

      hideTimeout.current = setTimeout(() => {
        setIsVisible(false)
      }, hideDelay)
  }

  return (
    <div
    className={styles.toolTipContainer}
      onMouseEnter={showToolTip}
      onMouseLeave={hideToolTip}
    >
      {children}
      <div
        className={`${styles.toolTip} ${styles[`${position}`]} ${isVisible ? styles.visible : ''}`}
      >{message}</div>
      </div>
  )
}
