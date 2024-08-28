import React, { useEffect, useState, ReactNode } from 'react'

interface IPropTypes {
  children: ReactNode
}



const Wrapper = (props: IPropTypes) => {
  console.log("inside the wrapper")
  return (
    setTimeout(() => {
      console.log("inside the timeout")
      return props.children
    }, 4000)
  )
}


const Contact = ( ) => {


  return (
    <div>
      <Wrapper>
        <div>yoyoy</div>
      </Wrapper>
    </div>
  )
}

export default Contact


