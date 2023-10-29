import { useState } from 'react'
import './App.css'

import { selectUsers } from './app/store'
import { useAppDispatch, useAppSelector } from './hooks'
import { fetchUsers } from './features/users/usersSlice'
import { useGetProductsQuery } from './features/products/productsSlice'


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
      <div>
        <h1>yoyo</h1>
      </div>
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
    </>
  )
}

export default App
