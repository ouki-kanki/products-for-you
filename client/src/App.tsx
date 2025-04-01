import { useCallback, useEffect } from 'react'
import styles from './app.module.scss'
import type { IUiConfig } from './types';

import { useLazyGetProductsQuery } from './features/products/productsSlice'
import { hideSidebar } from './features/UiFeatures/UiFeaturesSlice';

import { EcommerceRoutes } from './routes';
import { Sidebar } from './components/Sidebar/Sidebar'
import { CartModal } from './pages'

import { useDebounce } from './hooks/useDebounce';

import { useDispatch } from 'react-redux';
import { sendInitCartToMiddleware, initCart } from './features/cart/cartSlice';

import type { ICredentials } from './types';



function App() {
  const dispatch = useDispatch()

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
      <div>IS LOADING</div>
    )
  }

  return (
    <div className={styles.appContainer}>
        <Sidebar/>
        <CartModal/>
      <div className={styles.contentNavContainer}>
        <EcommerceRoutes/>
      </div>
    </div>
  )
}

export default App
