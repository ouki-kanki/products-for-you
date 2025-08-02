import { createRoot } from "react-dom/client";
import type { Root } from 'react-dom/client';
import type { NotificationWithId } from "../../../features/notifications/notificationSlice";

import { NotificationsContainer } from "./NotificationsContainer";

type Notifications = NotificationWithId | Array<NotificationWithId>

let container: HTMLElement | null = null;
let root: Root | null = null;
let timer: ReturnType<typeof setTimeout> | null = null

export const ShowNotificationV2 = (notifications: Notifications) => {

  // provide always an array, easier to remove the container from the dom
  const notificationArr = Array.isArray(notifications) ? notifications : [ notifications ]

  if (!container) {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  }

  if (timer) {
    clearTimeout(timer)
  }

  root?.render(<NotificationsContainer notifications={notificationArr}/>)

  // give a buffer to react to remove other children
  if (notificationArr.length === 0) {
    timer = setTimeout(() => {
      root?.unmount()
      document.body.removeChild(container!)
      container = null;
      root = null;
      timer = null;
    }, 100);
  }
}
