import { createPortal } from 'react-dom'
import { useAppSelector } from '../hooks'
import { NotificationsContainer } from '../components/Notifications/V2/NotificationsContainer'

export const NotificationsPortal = () => {
  const notifications = useAppSelector(state => state.notifications)
  const container = document.getElementById('notifications-root')

  return container ? createPortal(<NotificationsContainer notifications={notifications}/>, container) : null;
}
