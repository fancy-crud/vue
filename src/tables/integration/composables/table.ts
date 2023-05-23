export interface Table extends Record<string, unknown> {
  label?: string
  value?: string
  field?: (row: unknown, index: number) => unknown
  format?: (value: unknown) => unknown
  allowCheckbox?: boolean
  allowImagePreview?: boolean
}

type RawTable<F, T> = { [K in keyof (Extract<F, T> & T)]: (Extract<F, T> & T)[K] } & Record<string, Table>

// export interface Table {
//   settings: {
//     url: string
//     filterParams?: object
//     search?: string
//     lookupField?: string
//     pagination?: {
//       page?: number
//       rowsPerPage?: number
//       count?: number
//     }
//   }
//   onCreate?: (response: unknown) => void
//   onUpdate?: (response: unknown) => void
// }

export function useTable<T, U extends Record<string, Table>>(form: T, args: RawTable<T, U>): { columns: U; form: T } {
  const columns = reactive(args) as U

  return {
    columns,
    form,
  }
}

const form = {
  firstName: {
    label: 'Primer Nombre',
    cancel: false,
  },
}

const table = useTable(form, {
  firstName: {
    label: '',
    calor: false,

  },
  actions: {
    label: '',
  },
})

console.log(table.columns.firstName.label)

