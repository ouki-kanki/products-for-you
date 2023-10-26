import { useState } from 'react'
import './App.css'

import { Routes, Route } from 'react-router-dom';

import NavBar from './components/NavBar/NavBar';
import Sidebar from './components/Sidebar/Sidebar';


import { Home, Categories, Cart, About, Account, Settings } from './components/Pages' 

function App() {
  const [count, setCount] = useState(0)

  const handleFetchUsers = async() => {
    try {
      const response = await fetch("http://localhost:8000/users/");
      const data = await response.json()

      console.log("the data from server", data)

    } catch (err) {
      console.log("the error from the server", err)
    }

  }


  return (
    <div className='App'>
      <div className='sidebar__container'>
        <Sidebar/>
      </div>
      <div className='content__nav_container'>
        {/* <div className='navbar__container'> */}
          <NavBar/>
        {/* </div> */}
        <div className='routes__container'>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/categories' element={<Categories/>}/>
            <Route path='/cart' element={<Cart/>}/>
            <Route path='/about' element={<About/>}/>
            <Route path='/account' element={<Account/>}/>
            <Route path='/settings' element={<Settings/>}/>
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App
