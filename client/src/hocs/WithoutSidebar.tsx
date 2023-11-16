import { useEffect, ReactNode } from 'react'
import { showSidebar, hideSidebar } from '../features/UiFeatures/UiFeaturesSlice'
import { useDispatch } from 'react-redux'

interface IProps {
  children: ReactNode
}

export const WithoutSidebar = ({ children }: IProps) => {
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
