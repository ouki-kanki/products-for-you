import { useState, useCallback } from 'react'
import './index.scss';
import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './hocs/ProtectedRoute';

import { selectUsers } from './app/store'
import { useAppDispatch, useAppSelector } from './hooks'
import { setToken } from './features/auth/Login/loginSlice';

import { fetchUsers } from './features/users/usersSlice'
import { useLazyGetProductsQuery } from './features/products/productsSlice'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruckFast, faPaintRoller } from '@fortawesome/free-solid-svg-icons';
import { faPaypal } from '@fortawesome/free-brands-svg-icons';

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
         Profile
        } from './components/pages'

import { Search } from './components/pages/Search';
import { useDebouncedEffect } from './hooks/useDebounced';


function App() {
  const [count, setCount] = useState(0)
  const users = useAppSelector(selectUsers)
  const dispatch = useAppDispatch()

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
  const handleSetToken = useCallback((token: string | null) => {
    if (token) {
      dispatch(setToken(token))
    }
  }, [dispatch])

  const debouncedHandleSetToken = useCallback(() => {
    const token = localStorage.getItem('token')
    handleSetToken(token)
  }, [handleSetToken])

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
            <Route path='/' element={<Home/>}>
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

        <div className='rest__container__for-testing'>
          <button onClick={() => dispatch(fetchUsers())}>fetch users</button>
        </div>
      </div>
    </div>
  )
}

export default App
