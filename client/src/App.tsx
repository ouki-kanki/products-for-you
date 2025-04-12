import { useCallback, useEffect } from 'react'
import styles from './app.module.scss'
import type { IUiConfig } from './types';
import { useTheme } from './context/hooks/useTheme';
import { useLocation } from 'react-router-dom';


import { useLazyGetProductsQuery } from './features/products/productsSlice'
import { hideSidebar } from './features/UiFeatures/UiFeaturesSlice';

import { EcommerceRoutes } from './routes';
import { Sidebar } from './components/Sidebar/Sidebar'
import { CartModal } from './pages'
import { Spinner } from './components/Spinner/Spinner';

import { useDebounce } from './hooks/useDebounce';

import { useDispatch } from 'react-redux';
import { sendInitCartToMiddleware, initCart } from './features/cart/cartSlice';

import type { ICredentials } from './types';


function App() {
  const dispatch = useDispatch()
  const { darkTheme, toggleTheme } = useTheme()
  const location = useLocation()


  console.log("the location", location.pathname)

  useEffect(() => {
    try {
      const strCartFromStorage = localStorage.getItem('cart')
      const cartFromStorage = JSON.parse(strCartFromStorage as string)
      const items = cartFromStorage.items
      const total = cartFromStorage.total
      const numberOfItems = cartFromStorage.numberOfItems

      dispatch(initCart({
        items,
        total,
        numberOfItems
      }))
    } catch (error) {
      console.log(error)
    }


  }, [dispatch])

  console.log("app triggered")

  const [
    trigger,
    {
      data: products,
      isLoading,
      isSuccess,
      isError,
      error
    }
  ] = useLazyGetProductsQuery()


  // TODO: this only serves to hide the sidebar. clean the code
  // TODO: move this to another file
  const handleUiConfig = useCallback((config: IUiConfig) => {
    const { isSidebarHidden } = config
    // console.log("the sidebar data from local" , isSidebarHidden)

    if (JSON.parse(isSidebarHidden as string)) {
      dispatch(hideSidebar())
    }
  }, [dispatch])

  // TODO: change the name, this was obsolete
  const debouncedHideSidebar = useCallback(() => {
    const isSidebarHidden = localStorage.getItem('is_sidebar_hidden');
    handleUiConfig({ isSidebarHidden })
  }, [handleUiConfig])

  useDebounce(debouncedHideSidebar, 200, [debouncedHideSidebar])

  if (isLoading) {
    return (
      <Spinner/>
    )
  }

  return (
    <div className={`${styles.appContainer} ${darkTheme ? 'dark-theme' : ''}`}>
        <div className={styles.clipMain}>
          {(location.pathname === '/' || location.pathname === '/login') && (
          <div className={styles.clipContainer}>
            <svg>
              <clipPath id="wave" clipPathUnits="objectBoundingBox">
                <path className="st0" d="M1,0c0,0-0.3,0.1-0.5,0.1S0.3,0,0,0.1V1h1L1,0z"/>
              </clipPath>
            </svg>
          </div>
            )
          }
        </div>
        <Sidebar/>
        <CartModal/>
      <div className={styles.contentNavContainer}>
        <EcommerceRoutes/>
      </div>
    </div>
  )
}

export default App
