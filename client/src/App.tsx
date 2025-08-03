import { useCallback, useEffect } from 'react'
import styles from './app.module.scss'
import type { IUiConfig } from './types';
import { useTheme } from './context/hooks/useTheme';
import { useSelector } from 'react-redux';
import { RootState } from './app/store/store';

import { hideSidebar } from './features/UiFeatures/UiFeaturesSlice';

import { EcommerceRoutes } from './routes';
import { Sidebar } from './components/Sidebar/Sidebar'
import { CartModal } from './pages'
import { NotificationsPortal } from './portals/NotificationsPortal';

import { useDebounce } from './hooks/useDebounce';

import { useDispatch } from 'react-redux';
import { sendInitCartToMiddleware, initCart } from './features/cart/cartSlice';

import { WaveClipPath } from './components/ClipPaths/Wave/WaveClipPath';


function App() {
  const dispatch = useDispatch()
  const { darkTheme } = useTheme()
  const isSideBarHidden = useSelector((state: RootState) => state.ui.isSidebarHidden)

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

  // TODO: this only serves to hide the sidebar. clean the code
  // TODO: move this to another file
  const handleUiConfig = useCallback((config: IUiConfig) => {
    const { isSidebarHidden } = config

    if (JSON.parse(isSidebarHidden as string)) {
      dispatch(hideSidebar())
    }
  }, [dispatch])

  // TODO: change the name, this is obsolete
  const debouncedHideSidebar = useCallback(() => {
    const isSidebarHidden = localStorage.getItem('is_sidebar_hidden');
    handleUiConfig({ isSidebarHidden })
  }, [handleUiConfig])

  useDebounce(debouncedHideSidebar, 200, [debouncedHideSidebar])


  const contentNavContainerStyles = `
  ${styles.contentNavContainer}
  ${isSideBarHidden ? styles.hidden : ''}
  `

  return (
    <div className={`${styles.appContainer} ${darkTheme ? 'dark-theme' : ''}`}>
        <WaveClipPath/>
        <Sidebar/>
        <CartModal/>
      <div className={contentNavContainerStyles}>
          <EcommerceRoutes/>
      </div>
      <NotificationsPortal/>
    </div>
  )
}

export default App
