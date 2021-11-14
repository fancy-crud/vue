import { http } from '@/composables/http'
import { AxiosResponse } from 'axios'
import { Ref } from 'vue'
import { IFormField } from '../interfaces/Form'
import { IParams } from '../interfaces/HTTP'
import { IColumn, ITableRowButtons } from '../interfaces/Table'


export function setupColumns(fields: IFormField, rowActions: boolean): IColumn[] {
  const columns: IColumn[] = []
  const fieldsNames = Object.keys(fields)

  fieldsNames.forEach((fieldKey: string) => {
    const field = fields[fieldKey]
    const column = { 
      name: fieldKey,
      label: field.label,
      required: true,
      field: fieldKey,
      align: 'left',
      sortable: true,
      ...field.header,
    }

    columns.push(column)
  })

  if (rowActions) {
    columns.push({
      name: 'actions',
      label: '',
      required: false,
      align: 'left',
      sortable: false
    })
  }

  return columns
}

export function setupButtons(buttons: {[key: string]: any}): ITableRowButtons {
  const { create, edit, remove } = buttons

  return {
    ...buttons,
    create: {
      color: 'blue-grey-7',
      hidden: false,
      icon: 'add',
      flat: true,
      round: true,
      ...create,
    },
    edit: {
      color: 'blue-grey-7',
      hidden: false,
      icon: 'edit',
      size: 'sm',
      flat: true,
      round: true,
      ...edit,
    },
    remove: {
      color: 'blue-grey-7',
      hidden: false,
      icon: 'delete',
      size: 'sm',
      flat: true,
      round: true,
      ...remove,
    },
    export: {
      color: 'blue-grey-7',
      hidden: false,
      icon: 'mdi-microsoft-excel',
      flat: true,
      round: true,
      ...buttons.export,
    }
  }
}

export function setupExportData(url: string, params: IParams, fields: IFormField, loading?: Ref<boolean>) {
  if (loading) loading.value = true

  http.axios.get(url, { params }).then((response: AxiosResponse) => {
    const data = (response.data as Array<{[key: string]: any}>)
    let csvContent = ''
    
    if (data.length) {
      const headersKeys: string[] = []
      const headersLabels: string[] = []
      const formats: { [key: string]: (value: any) => void } = {}
      
      Object.keys(data[0]).forEach((header: string) => {
        const field = fields[header]
        
        if (field) {
          const isExclude = ['header', 'excludeInExport'].reduce((previous, current) => previous[current] || false, field)

          if (!isExclude) {
            const label = ['header', 'label'].reduce((previous, current) => previous[current] || field.label, field)
            const format = ['header', 'format'].reduce((previous, current) => previous[current] || false, field)

            if (format) {
              formats[header] = format
            }

            headersKeys.push(header)
            headersLabels.push(label)
          }
        }
      })

      csvContent += headersLabels.join(',') + '\r\n'

      data.forEach((record: any) => {
        const row: string[] = []

        headersKeys.forEach((header: string) => {
          const value = Object.prototype.hasOwnProperty.call(formats, header) ? formats[header](record[header]) : record[header]

          if (typeof value === 'string') {
            value.includes(',') ? row.push(`"${value}"`) : row.push(value)
          } else {
            row.push(value)
          }

        })
        csvContent += row.join(',') + '\r\n'
      })
    }

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: 'text/csv; charset=utf-18'
    });

    const link = document.createElement("a");
    link.setAttribute("href", window.URL.createObjectURL(blob));

    link.setAttribute("download", "export.csv");
    document.body.appendChild(link);

    link.click()

    if (loading) loading.value = false
  })
}
