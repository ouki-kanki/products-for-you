import type { NotificationWithId } from '../../../features/notifications/notificationSlice'
import styles from './notificationContainer.module.scss'
import { NotificationV2 } from './NotificationV2'

export const NotificationsContainer = ({ notifications }: { notifications: NotificationWithId[] }) => {
  return (
    <div className={styles.container}>
      {notifications.map((n, i) => (
        <div
          key={n.id}
          className={`${styles.notification}`}
          style={{
            animationDuration: `${n.duration}ms`,
            animationDelay: `${i * 200}ms`
          }}
        >
          <NotificationV2 key={n.id} {...n}/>
        </div>
      ))}
    </div>
  )
}
