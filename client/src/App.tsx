import { useState, useCallback } from 'react'
import './index.scss';
import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './hocs/ProtectedRoute';

import { selectUsers } from './app/store'
import { useAppDispatch, useAppSelector } from './hooks'
import { fetchUsers } from './features/users/usersSlice'
import { useLazyGetProductsQuery } from './features/products/productsSlice'
import { setCredentials } from './features/auth/Login/loginSlice';

import { Sidebar } from './components/Sidebar/Sidebar'
import { Home, 
         About, 
         Cart, 
         Account, 
         Categories, 
         Contact,
         Settings,
         ProductsPage,
         LoginPage,
         SignUp,
         Profile,
         ErrorPage,
         LandingPage
        } from './components/pages'

import { Search } from './components/pages/Search';
import { useDebouncedEffect } from './hooks/useDebounced';

import { useDispatch } from 'react-redux';

import type { ICredentials } from './types';


function App() {
  const [count, setCount] = useState(0)
  const dispatch = useDispatch()
  const users = useAppSelector(selectUsers)

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


  const debouncedHandleSetToken = useCallback(() => {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('user_id');
    handleSetCredentials({ userId, token })
  }, [handleSetCredentials])

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
    <div className='app_container'>
      <Sidebar/>
      <div className='content__nav-container'>
        <div className='routes__container'>
          <Routes>
            <Route path='*' element={<ErrorPage/>}/>
            <Route path='/' element={<Home/>}>
              <Route index element={<LandingPage/>}/>
              <Route path='/categories' element={<Categories/>}/>
              <Route path='/cart' element={<Cart/>}/>
              <Route path='/about' element={<About/>}/>
              <Route path='/contact' element={<Contact/>}/>
              <Route path='/account' element={<Account/>}/>
              <Route path='/settings' element={<Settings/>}/>
              <Route path='/products' element={<ProductsPage/>}/>
              <Route path='/search' element={<Search/>}/>
              <Route path='login' element={<LoginPage/>}/>
              <Route path='sign-up' element={<SignUp/>}/>
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
