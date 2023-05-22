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
