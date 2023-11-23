import { useEffect, useState, useCallback } from 'react'
import styles from './navbar.module.scss';
import { useAuth } from '../../hooks/useAuth';

import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';


import { SearchForm } from '../../UI/Forms';
import { Button } from '../../UI/Button/Button';
import cartIcon from '../../assets/svg_icons/cart.svg';
import bellIcon from '../../assets/svg_icons/bell.svg'

import { faHandPointLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export const NavBar = () => {
  const [showNav, setShowNav] = useState(true)
  const [lastScrollValue, setLastScrollValue] = useState(0)
  const navigate = useNavigate()
  const { pathname } = useLocation();

  const { token, logout } = useAuth()
  console.log("the token", token)

  const handleNavigate = (destination: string) => () => {
    navigate(destination);
  }

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

  // TODO: does the warning that navigate is missing from deps gives problems ?
  const handleBack = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") { 
      navigate(-1) // this is like legacy history?
    }
  }, [])


  useEffect(() => {

    window.addEventListener('scroll', handleNavShow)
    window.addEventListener('keydown', handleBack as EventListenerOrEventListenerObject);

    return () => {
      window.removeEventListener('scroll', handleNavShow)
      window.removeEventListener('keydown', handleBack as EventListenerOrEventListenerObject)
    }
  }, [lastScrollValue, handleNavShow, handleBack])
  
  
  const renderLoginLogout = () => {
    if (token) {
      return (
        <Button
          onClick={() => logout()} 
          size='m'>Logout</Button>          
          )  
      } else {
        return (
          <Button
            onClick={handleNavigate('login')} 
            size='m'>Login</Button>
          )
      }
  }

  return (
    <nav className={showNav ? styles.navContainer : styles.navContainer__hidden}>
      {/* LEFT SIDE */}
      <div className={styles.leftContainer}>
        {pathname !== '/' && (
          <Link
            to='/'
            className={`${styles.icons} ${styles.back}`}
            > 
            <FontAwesomeIcon
              size='2x' 
              icon={faHandPointLeft}/>
          </Link>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className={styles.rightContainer}>
        <div className={styles.searchContainer}>
          <SearchForm/>
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
          <div className={`margin-right-10 ${styles.centerField}`}>
            { pathname === '/login' 
              ? <p className='annotation'>Don't Have an Account ? </p>
              : renderLoginLogout()
            }
          </div>
          { !token && (
            <div 
              className={styles.signUp}
              onClick={handleNavigate('sign-up')}
              >
              Sign <span>U</span>p
            </div>
            )
          }
        </div>
      </div>
    </nav>
  )
}
