import type { NormalizedField } from '../../core'
import { GenerateFormData } from '../../core/services/fields'
import type { UpdateRequestOptions } from '@/http'

export class UpdateRecord {
  execute(fields: Record<string, NormalizedField>, url: string, lookupValue: string | number, options?: UpdateRequestOptions) {
    const { jsonForm, formData } = new GenerateFormData().execute(fields)
    const _formData = formData || jsonForm

    useRequestUpdate(url, lookupValue, _formData, options)
  }
}
