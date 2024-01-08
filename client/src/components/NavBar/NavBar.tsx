import { useSelector } from 'react-redux';
import { useEffect, useState, useCallback } from 'react'
import styles from './navbar.module.scss';
import { useAuth } from '../../hooks/useAuth';

import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { hideSidebar, showSidebar } from '../../features/UiFeatures/UiFeaturesSlice';

import { SearchForm } from '../../UI/Forms';
import { Button } from '../../UI/Button/Button';
import cartIcon from '../../assets/svg_icons/cart.svg';
import bellIcon from '../../assets/svg_icons/bell.svg'

import { faHandPointLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { RootState } from '../../app/store';
import { useGetProfileQuery } from '../../api/userApi';

import BackIcon from '../../assets/svg_icons/back_icon.svg?react'
import CartOutlined from '../../assets/svg_icons/cart_outlined.svg?react';

export const NavBar = () => {
  const [showNav, setShowNav] = useState(true)
  const [lastScrollValue, setLastScrollValue] = useState(0)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { pathname } = useLocation();
  const { token, logout } = useAuth()
  const userId = useSelector((state: RootState) => state.auth.userId)
  const isSideBarHidden = useSelector((state: RootState) => state.ui.isSidebarHidden)
  // const { trigger, data, error } = useProfile()

  // TODO: THIS IS A NASTY FIX !!! have to fix later 
  const { data, isFetching, isLoading } = useGetProfileQuery((userId ? userId.toString() : ''), { skip: !userId })

  // TODO : transfrom the response inside the query to retrieve only the image and the name 
  // TODO: PROFILE DATA INSIDE THE QUERY REMAINS AFTER LOG OUT 

  // console.log("the data", data)
  // console.log("isFetching", isFetching)
  // console.log("is Loading", isLoading)

  // useEffect(() => {
  //   if (profile === null) {
  //     console.log("inside the trigger")
  //     trigger('1')
  //   }
  // }, [userId])



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

  const handleSideBarVis = () => {
    if (isSideBarHidden) {
      dispatch(showSidebar())
    } else {
      dispatch(hideSidebar())
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
        <div onClick={handleSideBarVis}>
          <BackIcon className={styles.backIcon}/>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className={styles.rightContainer}>
        <div className={styles.searchContainer}>
          <SearchForm/>
        </div>

        {/* <div className={styles.cartContainer}>
          <CartOutlined className={styles.cart}/>
        </div> */}

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
          {data && token && (
            <div
              onClick={handleNavigate('/profile')} 
              className={styles.profileImageContainer}>
              {/* <div>yoyo</div> */}
              <img src={data.image} alt='profile image' />
            </div>
          )}

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
