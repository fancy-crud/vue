import type { ComputedRef, Ref, UnwrapNestedRefs } from 'vue'
import type { AxiosError } from 'axios'
import type { Form } from '@/forms'
import type { AxiosResponse } from '@/modules/axios'

export interface HandleRequestStatusCodes extends Record<number, (form: Form, data: any) => void> {}

export interface SameAPIEndpoint {
  [key: string]: string[]
}

export interface Params {
  [key: string]: unknown
}

export interface JSONForm {
  [key: string]: unknown
}

interface RequestRecord {
  url: string
  form: JSONForm | FormData
}

type FilterParams<T> = { [Key in keyof T]: unknown }

export interface Pagination {
  page?: number
  count?: number
}

export interface GetListRequest<T = {}> {
  url: string
  _search?: string
  filterParams?: FilterParams<T> | {}
  pagination?: Pagination
}

export interface RecordManager<T, F> {
  filterParams: UnwrapNestedRefs<F>
  pagination: Required<Pagination>
  fetchItems: (page?: number) => void
  loading: Ref<boolean>
  list: ComputedRef<T[]>
}

export interface UpdateRequest extends RequestRecord {
  lookupValue: string | number
}

export interface RetrieveRequest {
  url: string
  lookupValue: string | number
}

export interface DeleteRequest {
  url: string
  lookupValue: string | number
  hardDelete?: boolean
  fieldName?: string
}

export interface RequestResponse {
  isActionSucceed: boolean
  value: unknown
}

export type OnSuccess = (response: AxiosResponse) => void
export type OnFailed = (error: AxiosError) => void

export interface DefaultOptions {
  onSuccess?: () => void
  onFailed?: (e: any) => void
}

export interface RequestDefaultOptions {
  onSuccess?: OnSuccess
  onFailed?: OnFailed
  autoTrigger?: boolean
}

export interface CreateRequestOptions extends RequestDefaultOptions { }
export interface UpdateRequestOptions extends RequestDefaultOptions { }
export interface RetrieveRequestOptions extends RequestDefaultOptions { }
export interface DeleteRequestOptions extends RequestDefaultOptions { }

export interface ListRequestOptions extends RequestDefaultOptions {
  hotFetch?: boolean
}

