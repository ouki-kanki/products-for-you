import { useRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification, removeNotification } from '../features/notifications/notificationSlice';
import type { NotificationProps } from '../components/Notifications/_Notification';

// delay between notification create and destroy
const wait = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))
const getId = () => Date.now() + Math.floor(Math.random() * 1000)

export const useNotifications = () => {
  const dispatch = useDispatch()
  const creationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const removalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const arrayTimerRef = useRef<Array<ReturnType<typeof setTimeout>>>([])
  const [delayFactor, setDelayFactor] = useState(0)

  useEffect(() => {
    return () => {
      if (creationTimerRef.current) clearTimeout(creationTimerRef.current)
      if (removalTimerRef.current) clearTimeout(removalTimerRef.current)

      const timers = arrayTimerRef.current
      if (timers && timers.length > 0) {
        timers.forEach(timer => clearTimeout(timer))
      }
    }
  }, [])

  /**
   * if this is used inside a loop to show multiple messages it creates animation bugs
   * handleSequential or handleStacked must be used instead
   * @param notification
   * @param delay
   */
  const showNotification = (notification: NotificationProps, delay?: number) => {
    const id = getId()
    const creationDelay = delay ?? 500

    creationTimerRef.current = setTimeout(() => {
      dispatch(addNotification({ ...notification, id }))
      setDelayFactor(prev => prev + 1)

      removalTimerRef.current = setTimeout(() => {
        dispatch(removeNotification(id))
        setDelayFactor(prev => prev -1)
      }, notification.duration ?? 3000);
    }, creationDelay);
  }

  const handleSequentialArrayOfNotifications = async (notifications: Array<NotificationProps>) => {
    for (const notification of notifications) {
      const id = getId()

      dispatch(addNotification({ ...notification, id }))

      await wait(notification.duration)
      dispatch(removeNotification(id))

      await wait()
    }
  }

  const handleStackedNotificationsArray = async (notifications: Array<NotificationProps>) => {
    const notificationIdsAndDuration: { id: number, duration: number }[] = []

    for (const notification of notifications) {
      const id = getId()

      dispatch(addNotification({ ...notification, id }))
      notificationIdsAndDuration.push({ id, duration: notification.duration ?? 500})
      await wait(1000)
    }

    for (const { id, duration } of notificationIdsAndDuration) {
      const timer = setTimeout(() => {
        dispatch(removeNotification(id))
      }, duration);

      arrayTimerRef.current?.push(timer)
      await wait(1000)
    }
  }

  return {
    showNotification,
    handleSequentialArrayOfNotifications,
    handleStackedNotificationsArray
  }
}
