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


import { NavBar } from './components/NavBar/NavBar'
import { Sidebar } from './components/Sidebar/Sidebar'
import { Button } from './UI/Button/Button';
import { ChatButton } from './components/Buttons/ChatButton';

import { Home, 
         About, 
         Cart, 
         Account, 
         Categories, 
         Contact,
         ListProductsTest, 
         Settings,
         ProductsPage,
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

  console.log("the data", products)
  return (
    <>
      <Sidebar/>
      <div className='content__nav-container'>
        <NavBar/>
        <div className='routes__container'>
          <div className='chatButtonContainer'>
            <ChatButton/>        
          </div>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/categories' element={<Categories/>}/>
            <Route path='/cart' element={<Cart/>}/>
            <Route path='/about' element={<About/>}/>
            <Route path='/contact' element={<Contact/>}/>
            <Route path='/account' element={<Account/>}/>
            <Route path='/settings' element={<Settings/>}/>
            <Route path='/products' element={<ProductsPage/>}/>
            <Route path='/search' element={<Search/>}/>
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
    </>
  )
}

export default App
