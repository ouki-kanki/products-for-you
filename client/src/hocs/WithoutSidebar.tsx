import { useEffect } from 'react'
import { showSidebar, hideSidebar } from '../features/UiFeatures/UiFeaturesSlice'
import { useDispatch } from 'react-redux'
import type { IChildren } from '../types'


export const WithoutSidebar = ({ children }: IChildren) => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(hideSidebar())

    return () => {
      dispatch(showSidebar())
    }
  }, [])


  return (
    <div>
      {children}
    </div>
  )
}
