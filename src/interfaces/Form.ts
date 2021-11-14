interface IButton {
    label?: string,
    createLabel?: string,
    updateLabel?: string,
    [key: string | number]: any
}

export interface IFormTitles {
    hidden?: boolean,
    create?: string,
    update?: string
}

export interface IFormButtons {
    main?: IButton,
    aux?: IButton,
    [key: string | number]: any
}

export interface IFormField<T> {
    [key: string]: T
}

export interface IFormProps<T> {
    fields: IFormField<T>,
    record: IFormRecord,
    mode: string,
    buttons: IFormButtons,
    messages: {[key: string]: T}
}

export interface IForm<T> {
    fields: IFormField<T>,
    settings?: {
        titles?: IFormTitles,
        buttons?: IFormButtons,
    },
    [key: string]: any
}

export interface IFormRecord {
    [key: string]: any
}