import { useEffect, useState, useCallback } from 'react'
import styles from './navbar.module.scss';


export const NavBar = () => {
  const [showNav, setShowNav] = useState(true)
  const [lastScrollValue, setLastScrollValue] = useState(0)

  const handleNavShow =  useCallback(() => {
    setTimeout(() => {
      if (window.scrollY > lastScrollValue) {
        setShowNav(false)
      } else  {
        setShowNav(true)
      }

      setLastScrollValue(window.scrollY)
    }, 50)
  }, [lastScrollValue])

  useEffect(() => {
    window.addEventListener('scroll', handleNavShow)

    return () => {
      window.removeEventListener('scroll', handleNavShow)
    }
  }, [lastScrollValue, handleNavShow])


  return (
    <ul className={showNav ? styles.navContainer : styles.navContainer__hidden}>
      <li>Cart</li>
      <li>Account</li>
      <li>Setting</li>
    </ul>
  )
}
