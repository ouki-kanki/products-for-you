import { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../app/store/store';
import { useTheme } from '../../context/hooks/useTheme';

import { showCartModal } from '../.z./features/UiFeatures/UiFeaturesSlice';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';

import styles from './navbar.module.scss';
import { hideSidebar, showSidebar } from '../../features/UiFeatures/UiFeaturesSlice';
import { SearchForm } from '../../UI/Forms';
import { Button } from '../../UI/Button/Button';
import cartIcon from '../../assets/svg_icons/cart.svg';
import bellIcon from '../../assets/svg_icons/bell.svg'
import { AnimatedCross } from '../Animations/AnimatedCross/AnimatedCross';
import { ThemeBtn } from './ThemeBtn/ThemeBtn';



import { useAuth } from '../../hooks/useAuth';
import { useLogoutMutation } from '../../api/authApi';
import { useLazyGetUserProfileQuery } from '../../api/userApi';
import { showNotification } from '../Notifications/showNotification';

export const NavBar = () => {
  const [showNav, setShowNav] = useState(true)
  const [lastScrollValue, setLastScrollValue] = useState(0)
  const { darkTheme } = useTheme()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { pathname } = useLocation();
  const { token, logout } = useAuth()
  const [trigger, { data }] = useLazyGetUserProfileQuery()
  const isCartUpdating = useSelector((state: RootState) => state.cart.isUpdating)
  const isSideBarHidden = useSelector((state: RootState) => state.ui.isSidebarHidden)
  const numberOfproductInCart = useSelector((state: RootState) => state.cart.numberOfItems)
  // const { isScrollingDown } = useSroll()

  useEffect(() => {
    if (token) {
      trigger()
    }
  }, [token, trigger])

  const [ clearCookie, { data: logOutData, isLoading: isLoadingLogOut, isSuccess, isError, error }] = useLogoutMutation()

  // TODO : transfrom response to retrieve only the image and the name
  const handleNavigate = (destination: string) => () => {
    navigate(destination);
  }

  const handleLogOut = async () => {
    // clear store
    logout()
    // clear cookie
    const data = await clearCookie().unwrap()
    showNotification({
      appearFrom: 'from-bottom',
      duration: 2000,
      message: data.message,
      hideDirection: 'to-bottom',
      position: 'bottom-right',
      overrideDefaultHideDirection: false
    })
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

  const handleBack = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      navigate(-1) // this is like legacy history?
    }
  }, [navigate])


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
          onClick={handleLogOut}
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

  const handleOpenCart = () => {
    // dispatch(showCartModal())
    navigate('/cart')
  }

  return (
    <nav className={showNav ? styles.navContainer : styles.navContainer__hidden}>
      {/* LEFT SIDE */}
      <div className={styles.leftContainer}>
        <AnimatedCross
          onClick={handleSideBarVis}
          isHidden={isSideBarHidden}
        />
        {/* <div onClick={handleSideBarVis}> */}
          {/* <FontAwesomeIcon icon={isSideBarHidden ? faPlus : faMinus}/> */}
        {/* </div> */}
        {(isSideBarHidden && pathname !== '/') && (
          <Link
            to='/'
            className={`${styles.icons} ${styles.back}`}>
            Products For You
          </Link>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className={styles.rightContainer}>
        <div className={styles.searchContainer}>
          <SearchForm/>
        </div>

        <div className={styles.buttonsContainer}>
          <div
            className={`${styles.icons} ${styles.cartIconContainer} ${isCartUpdating && styles.activeCartBtn}`}
            onClick={handleOpenCart}>
              <img src={cartIcon} alt="cart button" />
              {numberOfproductInCart > 0 && (
                <div className={styles.cartNotification}>
                  <span>{numberOfproductInCart}</span>
                </div>
              )}
          </div>

          <Link
            className={styles.icons}
            to='/'>
            <img src={bellIcon} alt="notification button" />
          </Link>
          {data && token && (
            <div
              onClick={handleNavigate('/profile')}
              className={styles.profileImageContainer}>
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
              className={`${styles.signUp} ${darkTheme ? styles.dark : ''}`}
              onClick={handleNavigate('sign-up')}
              >
              Sign <span>U</span>p
            </div>
            )
          }
          <div className={styles.themeBtnContainer}>
            <ThemeBtn/>
          </div>
        </div>
      </div>
    </nav>
  )
}
