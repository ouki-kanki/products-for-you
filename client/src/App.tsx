import { useState } from 'react'
import './index.scss';
import { Routes, Route } from 'react-router-dom'

import { selectUsers } from './app/store'
import { useAppDispatch, useAppSelector } from './hooks'
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
         Login,
         SignUp
        } from './components/pages'

import { Search } from './components/pages/Search';


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

  // lazy use of rtk 
  const handleFetchProducts = () => {
    trigger()
  }


  if (isLoading) {
    return (
      <div>IS LOADING</div>
    )
  }

  // TODO: receive hide navbar state from redux to change the class of the content to be max - width

  console.log("the data", products)
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
              <Route path='login' element={<Login/>}/>
              <Route path='sign-up' element={<SignUp/>}/>
            </Route>
          </Routes>
        </div>

        <div className='rest__container__for-testing'>
          <button onClick={() => dispatch(fetchUsers())}>fetch users</button>
          <h1>Vite + React</h1>
          <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
              count is {count}
            </button>
          </div>
        </div>
      </div>
    {/* </div> */}
    </div>
  )
}

export default App
