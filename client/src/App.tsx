import { useState } from 'react'
import './index.scss';

import { Routes, Route } from 'react-router-dom'

import { selectUsers } from './app/store'
import { useAppDispatch, useAppSelector } from './hooks'
import { fetchUsers } from './features/users/usersSlice'
import { useGetProductsQuery } from './features/products/productsSlice'

import { NavBar } from './components/NavBar/NavBar'
import { Sidebar } from './components/Sidebar/Sidebar'

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

function App() {
  const [count, setCount] = useState(0)
  const users = useAppSelector(selectUsers)
  const dispatch = useAppDispatch()

  const {
    data: products,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetProductsQuery()

  if (isLoading) {
    return (
      <div>IS LOADING</div>
    )
  }
  // console.log(" the users", users)
  console.log("the data", products)
  return (
    <>
    {/* <div className='main__container'> */}
      <div className='sidebar__container'>
        <Sidebar/>
      </div>
      <div className='content__nav-container'>
        <NavBar/>
        <div className='routes__container'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/categories' element={<Categories/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/account' element={<Account/>}/>
          <Route path='/settings' element={<Settings/>}/>
          <Route path='/products' element={<ProductsPage/>}/>
        </Routes>
        </div>
        <div className='rest__container__for-testing'>
          <button onClick={() => dispatch(fetchUsers())}>fetch users</button>
          <h1>Vite + React</h1>
          <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
              count is {count}
            </button>
            <p>
              Edit <code>src/App.tsx</code> and save to test HMR
            </p>
          </div>
          <p className="read-the-docs">
            Click on the Vite and React logos to learn more
          </p>
          <h1>yoyo</h1>
        </div>
      </div>
    {/* </div> */}
    </>
  )
}

export default App
