import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Test from './components/Test';
import { TestTwo } from './components/TestTwo';


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
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <Test/>
      <TestTwo/>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={() => handleFetchUsers()}>
          Fetch Users
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
