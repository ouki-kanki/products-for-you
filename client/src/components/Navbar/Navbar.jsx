import React, { useEffect, useState } from 'react'
import styles from './Navbar.module.css';

const NavBar = () => {
  const [showNav, setShowNav] = useState(true)
  const [lastScrollValue, setLastScrollValue] = useState(0)

  useEffect(() => {
    window.addEventListener('scroll', handleNav)

    return () => {
      window.removeEventListener('scroll', handleNav)
    }
  }, [lastScrollValue])

  const handleNav = () => {
    if (window.scrollY > lastScrollValue) {
      setShowNav(false)
    } else {
      setShowNav(true)
    }

    setLastScrollValue(window.scrollY)
  }

  return (
    <ul className={showNav ? styles.navContainer : styles.navContainer__hidden}>
      <li>Cart</li>
      <li>Account</li>
      <li>Settings</li>
    </ul>
  )
}

export default NavBar