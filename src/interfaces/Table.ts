import { Ref } from "@vue/reactivity";

interface IButton {
    color: string,
    hidden: boolean,
    icon: string | null,
    outline: boolean,
    onClick?: Function
}

export interface IColumn {
    name: string,
    label: string,
    required: boolean,
    align: string,
    field?: string | Function,
    format?: Function,
    sortable: boolean
}

export interface IPagination {
    page: number,
    rowsPerPage: number,
    rowsNumber: number
}

export interface IRecords {
    filterParams: { [key: string]: string | number | boolean }
    pagination: IPagination,
    fetchItems: Function,
    search: Ref<string>,
    loading: Ref<boolean>,
    list: {
        unmutableItems: Array<any>,
        items: Array<any>
    },
}

export interface ITableRowButtons {
    create: IButton,
    edit: IButton,
    remove: IButton,
    export: IButton,
    styles?: {}
}