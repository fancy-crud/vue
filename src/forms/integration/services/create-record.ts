import type { CreateRequestOptions, NormalizedField } from '@fancy-crud/core'
import { GenerateFormData } from '@fancy-crud/core'

export class CreateRecord {
  execute(fields: Record<string, NormalizedField>, url: string, options?: CreateRequestOptions) {
    const { jsonForm, formData } = new GenerateFormData().execute(fields)
    const _formData = formData || jsonForm

    useRequestCreate(url, _formData, options)
  }
}
