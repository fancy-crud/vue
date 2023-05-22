import type { Notification, NotificationHandler } from '@/forms/integration'

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
