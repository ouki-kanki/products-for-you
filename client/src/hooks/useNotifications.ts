import { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification, removeNotification } from '../features/notifications/notificationSlice';
import type { NotificationProps } from '../components/Notifications/_Notification';


export const useNotifications = () => {
  const dispatch = useDispatch()
  const creationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const removalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (creationTimerRef.current) clearTimeout(creationTimerRef.current)
      if (removalTimerRef.current) clearTimeout(removalTimerRef.current)
    }
  }, [])

  return (notification: NotificationProps) => {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    const creationDelay = 100

    creationTimerRef.current = setTimeout(() => {
      dispatch(addNotification({ ...notification, id }))

      removalTimerRef.current = setTimeout(() => {
        dispatch(removeNotification(id))
      }, notification.duration ?? 3000);
    }, creationDelay);
  }
}
