import React, { useState, useEffect } from 'react'

export const HideWrapper = (props) => {
  const [visible, setVisible] = useState(false)
  
  useEffect(() => {
    setInterval(() => {
      setVisible(true)
    }, 4000);
  }, [])

  if (visible) return props.body
  else return null;

}

const HiderWrapper = props => {
  return (
    setTimeout(() => {
      return props.children
    }, 4000)
  )
}

