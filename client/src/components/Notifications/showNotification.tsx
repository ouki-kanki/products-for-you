import ReactDOM from 'react-dom/client';
import type { NotificationProps } from './_Notification';
import { _Notification as Notification } from './_Notification';


/**
 * hidedirection will be the same as the appearFrom direction unless overrideDefaultHideDirection is set to true
 * @param param0
 * @returns
 */
export const showNotification = ({ message, position = 'bottom-right', type = 'success', duration = 2000, appearFrom = 'from-bottom', hideDirection = 'to-bottom', overrideDefaultHideDirection = false }: NotificationProps) => {
  const container = document.createElement('div')
  document.body.appendChild(container)

  ReactDOM.createRoot(container).render(<Notification message={message} position={position} type={type} duration={duration} appearFrom={appearFrom} hideDirection={hideDirection} overrideDefaultHideDirection={overrideDefaultHideDirection}/>);

  setTimeout(() => {
    document.body.removeChild(container)
  }, duration)
}
