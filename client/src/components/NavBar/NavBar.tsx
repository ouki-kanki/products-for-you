import { useEffect, useState, useCallback, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../app/store/store';
import { useTheme } from '../../context/hooks/useTheme';

import { showCartModal } from '../.z./features/UiFeatures/UiFeaturesSlice';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDebouncedFunction } from '../../hooks/useDebounce';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

import styles from './navbar.module.scss';
import { hideSidebar, showSidebar } from '../../features/UiFeatures/UiFeaturesSlice';
import { SearchForm } from '../../UI/Forms';
import { Button } from '../../UI/Button/Button';
import cartIcon from '../../assets/svg_icons/cart.svg';
import bellIcon from '../../assets/svg_icons/bell.svg'
import { AnimatedCross } from '../Animations/AnimatedCross/AnimatedCross';
import { ThemeBtn } from './ThemeBtn/ThemeBtn';

import { useAuth } from '../../hooks/useAuth';
import { useLogoutMutation } from '../../api/authApiV2';
import { useLazyGetUserProfileQuery } from '../../api/userApi';
import { showNotification } from '../Notifications/showNotification';

export const NavBar = () => {
  const [showNav, setShowNav] = useState(true)
  const { darkTheme } = useTheme()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { pathname } = useLocation();
  const { token, logout } = useAuth()
  const [getProfile, { data }] = useLazyGetUserProfileQuery()
  const isCartUpdating = useSelector((state: RootState) => state.cart.isUpdating)
  const isSideBarHidden = useSelector((state: RootState) => state.ui.isSidebarHidden)
  const numberOfproductInCart = useSelector((state: RootState) => state.cart.numberOfItems)

  const lastScrollValue = useRef(window.scrollY)

  useEffect(() => {
    if (token) {
      getProfile()
    }
  }, [token, getProfile])

  const [ logoutMut, { data: logOutData, isLoading: isLoadingLogOut, isSuccess, isError, error }] = useLogoutMutation()

  const handleNavigate = (destination: string) => () => {
    navigate(destination);
  }

  const handleLogOut = async () => {
    const data = await logoutMut().unwrap()

    showNotification({
      appearFrom: 'from-bottom',
      duration: 2000,
      message: data.message,
      hideDirection: 'to-bottom',
      position: 'bottom-right',
      overrideDefaultHideDirection: false
    })
    // navigate('/login')
  }

  // const debouncedCurrentScroll = useDebouncedValue<number>(window.scrollY, 200)
  const handleHideNavbar = useCallback(() => {
    const currentScroll = window.scrollY

    // console.log("the current scroll", currentScroll)
    // console.log("the last scroll", lastScrollValue.current)

    if (currentScroll > lastScrollValue.current) {
      setShowNav(false)
    } else {
      setShowNav(true)
    }
    lastScrollValue.current = currentScroll
  }, [])


  /**
   * TODO: something is off if delay is used
   * when the navbar hides it pushes the rest of the page up, when delay is used
   * the whole animation seems to be off. i need to keep the rest of the content to the same position and have
   * havbar sticky
   */
  const debouncedHandleHideNavbar = useDebouncedFunction(handleHideNavbar, 50)

  const handleBack = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      navigate(-1) // this is like legacy history?
    }
  }, [navigate])

  useEffect(() => {
    // window.addEventListener('scroll', debouncedHandleHideNavbar)
    window.addEventListener('scroll', handleHideNavbar)
    window.addEventListener('keydown', handleBack as EventListenerOrEventListenerObject);

    return () => {
      // window.removeEventListener('scroll', debouncedHandleHideNavbar)
      window.removeEventListener('scroll', handleHideNavbar)
      window.removeEventListener('keydown', handleBack as EventListenerOrEventListenerObject)
    }
  }, [])

  const renderIconBnt = () => (
    <Button
      shape='square'
      onClick={handleLogOut}
      >
        <FontAwesomeIcon
          className={styles.logIcon}
          icon={faSignInAlt}
          size='xl'
        />
      </Button>
  )

  const renderLoginLogout = () => {
    if (token) {
      return (
        <>
          <div className={styles.btnDesktop}>
            <Button
              onClick={handleLogOut}
              size='m'>Logout</Button>
          </div>
          {renderIconBnt()}
        </>
          )
      } else {
        return (
          <>
            <div className={styles.btnDesktop}>
              <Button
                onClick={handleNavigate('login')}
                size='m'>Login</Button>
            </div>
            {renderIconBnt()}
          </>
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
    {/* <nav className={styles.navContainer}> */}
      <div className={styles.leftContainer}>
        <div className={styles.crossContainer}>
          <AnimatedCross
            onClick={handleSideBarVis}
            isHidden={isSideBarHidden}
            />
        </div>
        {(isSideBarHidden && pathname !== '/') && (
          <Link
            to='/'
            className={`${styles.icons} ${styles.back}`}>
            Products For You
          </Link>
        )}
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


        <div className={`margin-right-10 ${styles.loginContainer} `}>
          { pathname !== '/login' && renderLoginLogout() }
        </div>

        {/* AVATAR */}
        {data && token && (
          <div
            onClick={handleNavigate('/profile')}
            className={styles.profileImageContainer}>
            <img src={data.image} alt='profile image' />
          </div>
        )}


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

      <div className={styles.searchContainer}>
        <SearchForm/>
      </div>
    </nav>
  )
}
