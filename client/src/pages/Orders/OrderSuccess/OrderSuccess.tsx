import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


export const OrderSuccess = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/search', {replace: true})
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div>
      <h1>Your order was completed</h1>
      <p>We will send you an email shrortly after</p>
    </div>
  )
}
