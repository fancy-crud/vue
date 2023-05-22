export enum NotificationType {
  success = 'success',
  warning = 'warning',
  error = 'error',
  info = 'info',
  default = 'default',
}

export interface Notification {
  type: NotificationType
  message?: string
  data?: any
}

export interface NotificationHandler extends Partial<Record<NotificationType, (notification?: Notification) => void>> {}

const notificationHandlers = new Map<symbol, NotificationHandler>()

export function useNotification(id: symbol) {
  function getHandler(): NotificationHandler {
    const handlers = notificationHandlers.get(id)

    if (!handlers) {
      notificationHandlers.set(id, {})
      return notificationHandlers.get(id)!
    }

    return handlers
  }

  function setNotificationHandler(handler: NotificationHandler) {
    Object.assign(getHandler(), handler)
  }

  function pushNotification(notification: Notification) {
    const handler = getHandler()[notification.type]

    if (!handler)
      return

    handler(notification)
  }

  function removeNotificationHandlers() {
    notificationHandlers.delete(id)
  }

  return {
    removeNotificationHandlers,
    setNotificationHandler,
    pushNotification,
  }
}
