import { useEffect, useState, useCallback } from 'react'
import styles from './navbar.module.scss';
import { Link } from 'react-router-dom';


import { Search } from '../../UI/Forms';
import { Button } from '../../UI/Button/Button';

import cartIcon from '../../assets/svg_icons/cart.svg';
import bellIcon from '../../assets/svg_icons/bell.svg'


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
    <div className={showNav ? styles.navContainer : styles.navContainer__hidden}>
      <div className={styles.searchContainer}>
        <Search/>
      </div>
      <div className={styles.buttonsContainer}>
        <Link
          className={styles.icons}
          to='/cart'>
          <img src={cartIcon} alt="cart button" />
        </Link>
        <Link
          className={styles.icons}
          to='/'>
          <img src={bellIcon} alt="notification button" />
        </Link>
        <Button size='m'>Login</Button>
      </div>
    </div>
  )
}
