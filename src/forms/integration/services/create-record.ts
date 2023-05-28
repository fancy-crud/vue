import type { NormalizedField } from '../../axioma'
import { GenerateFormData } from '../../axioma'
import type { CreateRequestOptions } from '@/http'

export class CreateRecord {
  execute(fields: Record<string, NormalizedField>, url: string, options?: CreateRequestOptions) {
    const { jsonForm, formData } = new GenerateFormData().execute(fields)
    const _formData = formData || jsonForm

    useRequestCreate(url, _formData, options)
  }
}
