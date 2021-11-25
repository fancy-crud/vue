import { Ref, reactive, watch } from 'vue'
import { http, getRecords } from '@/composables/http'
import { IColumn, ITableRowButtons } from '@/interfaces/Table'
import { IParams } from '@/interfaces/HTTP'
import { AxiosResponse } from 'axios'


export function setupColumns<T>(fields: T, rowActions: boolean) {
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

  return reactive(columns)
}

export function setupButtons<T extends Object>(buttons: T): ITableRowButtons {
  const create = buttons['create'] || {}
  const edit = buttons['edit'] || {}
  const remove = buttons['remove'] || {}
  const _export = buttons['export'] || {}

  return reactive({
    ...buttons,
    create: {
      color: 'blue-grey-7',
      icon: 'add',
      flat: true,
      round: true,
      ...create,
    },
    edit: {
      color: 'blue-grey-7',
      icon: 'edit',
      size: 'sm',
      flat: true,
      round: true,
      ...edit,
    },
    remove: {
      color: 'blue-grey-7',
      icon: 'delete',
      size: 'sm',
      flat: true,
      round: true,
      ...remove,
    },
    export: {
      color: 'blue-grey-7',
      icon: 'mdi-microsoft-excel',
      flat: true,
      round: true,
      ..._export,
    }
  })
}

export function exportData<T>(url: string, params: IParams, fields: T, loading?: Ref<boolean>) {
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

export function useTable<T extends Object>(props: T) {
  const table = reactive({
    form: props['modelValue'],
    retrievingRecord: false,
    deleteConfirmationDialog: false,
  })

  const buttons = setupButtons(props['buttons'])
  const columns = setupColumns(table['form']['fields'], props['rowActions'])

  const recordsManager = getRecords(props['url'], props['filterParams']);

  const setFormBtnAuxFunctionality = () => {
    if (!Object.prototype.hasOwnProperty.call(table['form'], "dialog")) {
      table['form'].dialog = false;
    }

    // Check if form has settings.buttons.aux.onClick
    // if isn't it, is created and then add function
    // to close form dialog
    ["settings", "buttons", "aux", "onClick"].reduce((aux, current) => {
      let result: any;
      if (aux[current]) {
        result = aux[current];
      } else {
        aux[current] = {};
        result = aux[current];
      }
      return result;
    }, table['form']);

    if (!(typeof table['form'].settings.buttons.aux.onClick === "function")) {
      table['form'].settings.buttons.aux.onClick = () => (table['form'].dialog = false);
    }
  }

  setFormBtnAuxFunctionality()

  if (!table['form']['record']) {
    table['form']['record'] = {}
  }

  watch(table['form']['record'], () => {
    table.retrievingRecord = false
  })

  return {
    table,
    buttons,
    columns,
    recordsManager
  }
}