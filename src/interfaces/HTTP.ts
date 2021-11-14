import { AxiosInstance } from 'axios'
import { IFormField } from './Form'
import { INotifications } from './Notification'

export interface ISameAPIEnpoint {
    [key: string]: {
        fields: string[],
        filterParams: {
            [key: string]: string | number | null | boolean
        }
    }
}

export interface IParams {
    [key: string]: string | number | boolean
}
