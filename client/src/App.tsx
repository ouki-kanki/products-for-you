import { useState, useCallback, useEffect } from 'react'
import styles from './app.module.scss'

import type { IUiConfig } from './types';

import { selectUsers } from './app/store/store'
import { useAppSelector } from './hooks'
import { fetchUsers } from './features/users/usersSlice_old'
import { useLazyGetProductsQuery } from './features/products/productsSlice'
import { showSidebar, hideSidebar } from './features/UiFeatures/UiFeaturesSlice';

import { EcommerceRoutes } from './routes';
import { Sidebar } from './components/Sidebar/Sidebar'
import { CartModal } from './pages'

import { useDebounce } from './hooks/useDebounce';

import { useDispatch } from 'react-redux';
import { initCart } from './features/cart/cartSlice';

import type { ICredentials } from './types';


function App() {
  const [count, setCount] = useState(0)
  const dispatch = useDispatch()
  const users = useAppSelector(selectUsers)

  useEffect(() => {
    console.log("__INIT__CART__")

    // TODO: move this to the middleware
    try {
      const strCartFromStorage = localStorage.getItem('cart')
      const cartFromStorage = JSON.parse(strCartFromStorage as string)
      const items = cartFromStorage.items
      const total = cartFromStorage.items.reduce((a, item: ICartItem) => a += (item.price * item.quantity), 0)
      const numberOfItems = cartFromStorage.items.length

      dispatch(initCart({
        items,
        total,
        numberOfItems
      }))
    } catch (error) {
      // TODO: handle the error
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

  // TODO : remove the following logic from the app and put it to another file . create a custom hook useKeepLoggedIn
  const handleSetCredentials = useCallback((creds: ICredentials) => {
    const { userId, token } = creds

    const data = {
      userId: Number(userId),
      token
    }

    // TODO : use the new auth
    // dispatch(setCredentials(data))
  }, [dispatch])


  const handleUiConfig = useCallback((config: IUiConfig) => {
    const { isSidebarHidden } = config
    // console.log("the sidebar data from local" , isSidebarHidden)

    if (JSON.parse(isSidebarHidden as string)) {
      dispatch(hideSidebar())
    }
  }, [dispatch])

  const debouncedHandleSetToken = useCallback(() => {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('user_id');
    const isSidebarHidden = localStorage.getItem('is_sidebar_hidden');

    handleUiConfig({ isSidebarHidden })
    handleSetCredentials({ userId, token })
  }, [handleSetCredentials, handleUiConfig])

  useDebounce(debouncedHandleSetToken, 500, [debouncedHandleSetToken])

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
