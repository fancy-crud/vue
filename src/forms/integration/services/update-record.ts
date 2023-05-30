import type { NormalizedField, UpdateRequestOptions } from '@fancy-crud/core'
import { GenerateFormData } from '@fancy-crud/core'

export class UpdateRecord {
  execute(fields: Record<string, NormalizedField>, url: string, lookupValue: string | number, options?: UpdateRequestOptions) {
    const { jsonForm, formData } = new GenerateFormData().execute(fields)
    const _formData = formData || jsonForm

    useRequestUpdate(url, lookupValue, _formData, options)
  }
}
