import { useState, useCallback, useEffect } from 'react'
// import './index.scss';
import styles from './app.module.scss'
import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './hocs/ProtectedRoute';


import type { IUiConfig } from './types';

import { selectUsers } from './app/store/store'
import { useAppSelector } from './hooks'
import { fetchUsers } from './features/users/usersSlice'
import { useLazyGetProductsQuery } from './features/products/productsSlice'
import { setCredentials } from './features/auth/Login/loginSlice';
import { showSidebar, hideSidebar } from './features/UiFeatures/UiFeaturesSlice';


import { Sidebar } from './components/Sidebar/Sidebar'
import { Home, 
         About,
         Cart, 
         CartModal, 
         Account, 
         Categories, 
         Contact,
         Settings,
         ProductsPage,
         LoginPage,
         SignUp,
         Profile,
         ErrorPage,
         LandingPage,
         ProductDetail,
         DeliveryTerms,
         TermsOfUse,
         Checkout
        } from './components/pages'

import { Search } from './components/pages/Search';
import { useDebouncedEffect } from './hooks/useDebounced';

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
      // TODO: inform the server ?
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

  // SET TOKEN FROM LOCAL

  // TODO : remove the following logic from the app and put it to another file . create a custom hook useKeepLoggedIn
  const handleSetCredentials = useCallback((creds: ICredentials) => {
    const { userId, token } = creds

    const data = {
      userId: Number(userId),
      token
    }

    dispatch(setCredentials(data))
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

  useDebouncedEffect(debouncedHandleSetToken, 500, [debouncedHandleSetToken])

  // lazy use of rtk 
  const handleFetchProducts = () => {
    trigger()
  }

  if (isLoading) {
    return (
      <div>IS LOADING</div>
    )
  }

  return (
    <div className={styles.appContainer}>
        <Sidebar/>
      <div className={styles.contentNavContainer}>
        <CartModal/>
        <div>
          <Routes>
            <Route path='*' element={<ErrorPage/>}/>
            <Route path='/' element={<Home/>}>
              <Route index element={<LandingPage/>}/>
              <Route path='/categories' element={<Categories/>}/>
              {/* <Route path='/cart' element={<Cart/>}/> */}
              <Route path='/about' element={<About/>}/>
              <Route path='/contact' element={<Contact/>}/>
              <Route path='/account' element={<Account/>}/>
              <Route path='/cart' element={<Cart/>}/>
              <Route path='/checkout' element={<Checkout/>}/>
              <Route path='/settings' element={<Settings/>}/>
              <Route path='/products/' element={<ProductsPage/>}/>
              <Route path='/products/:slug' element={<ProductsPage/>}/>
              <Route path='/testproducts/' element={<ProductsPage/>}/>
              <Route path='/products/:slug/:slug' element={<ProductDetail/>}/>
              <Route path='/search/:slug' element={<Search/>}/>
              <Route path='login' element={<LoginPage/>}/>
              <Route path='sign-up' element={<SignUp/>}/>
              <Route path='/delivery-terms' element={<DeliveryTerms/>}/>
              <Route path='/terms-of-use' element={<TermsOfUse/>}/>
              <Route element={<ProtectedRoute/>}>
                <Route path='profile' element={<Profile/>}/>
              </Route>
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App
