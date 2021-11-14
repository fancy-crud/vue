export interface INotificationMessage {
    message: string,
    color: string,
    display: boolean,
    [key: string]: any
}

export interface INotifications {
    create: INotificationMessage,
    update: INotificationMessage,
    delete: INotificationMessage,
    error: INotificationMessage,
}