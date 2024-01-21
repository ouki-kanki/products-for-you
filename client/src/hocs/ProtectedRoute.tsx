import { ReactNode } from 'react'
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

import type { RootState } from '../app/store/store';

interface ProtectedRouteProps {
  children?: ReactNode;
}


// TODO: maybe keep the user here, inform him that the page is protected and tell him to go to the login page?
export const ProtectedRoute: React.FC<ProtectedRouteProps> = () => {
  const token = useSelector((state: RootState) => state.auth.token)

  if (!token) {
    return (
      <Navigate to='/login' replace/>
    )
  } else {
    return <Outlet/>
  }
}
