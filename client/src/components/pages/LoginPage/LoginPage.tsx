import { Login } from '../../../features/auth/Login/Login'
import { WithoutSidebar } from '../../../hocs/WithoutSidebar'



// NOTE: handle redirect after login here? or inside the feature?
export const LoginPage = () => {
  return (
    <WithoutSidebar>
      <Login/>
    </WithoutSidebar>
  )
}
