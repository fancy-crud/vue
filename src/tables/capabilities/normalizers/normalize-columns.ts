import type { BaseFormField, ObjectWithNormalizedColumns, ObjectWithRawColumns } from '@/tables/axioma'

export class NormalizeColumns {
  execute(fields: BaseFormField, columns: ObjectWithRawColumns): ObjectWithNormalizedColumns {
    const mappedColumns: ObjectWithNormalizedColumns = {}

    Object.keys(fields).forEach((fieldKey) => {
      const column = columns[fieldKey]

      const field = fields[fieldKey]

      const label = field.label || ''
      const value = field.name || fieldKey

      const allowCheckbox = field.type === 'checkbox' && column?.allowCheckbox !== false
      const allowImagePreview = field.type === 'image' && column?.allowImagePreview !== false

      const rawColumn = columns[fieldKey] ? columns[fieldKey] : {}

      mappedColumns[fieldKey] = {
        label,
        value,
        allowCheckbox,
        allowImagePreview,
        ...rawColumn,
      }
    })

    return mappedColumns
  }
}
