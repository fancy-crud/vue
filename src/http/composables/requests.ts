import _ from 'lodash'
import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import type { Ref } from 'vue'

import type { NormalizedFieldStructure, NormalizedFields } from '@/forms'
import type { CreateRequestOptions, DeleteRequestOptions, JSONForm, ListRequestOptions, Pagination, RecordManager, RequestDefaultOptions, RetrieveRequestOptions, SameAPIEndpoint, UpdateRequestOptions } from '@/http'

export const http = {
  axios: {} as AxiosInstance,
  pagination: {
    results: 'results',
    count: 'count',
  },
}

function getPaginationResultsKey(data: any) {
  const splittedKey = http.pagination.results.split('.')
  return splittedKey.reduce((accum, key) => accum[key], data)
}

function getPaginationCountKey(data: any) {
  const splittedKey = http.pagination.count.split('.')
  return splittedKey.reduce((accum, key) => accum[key], data)
}

function onSuccess(response: AxiosResponse, options?: RequestDefaultOptions) {
  if (typeof options?.onSuccess === 'function')
    options?.onSuccess(response)
}

function onFailed(error: AxiosError, options?: RequestDefaultOptions) {
  if (typeof options?.onFailed === 'function')
    options?.onFailed(error)
}

export function setHttpConfig(options: unknown) {
  Object.assign(http, options)
}

export function buildURL({
  url,
  lookupValue,
}: {
  url: string
  lookupValue?: string | number
}): string {
  let result: string

  if (url.endsWith('/'))
    result = [url + String(lookupValue || ''), ''].join('/')

  else
    result = [url, String(lookupValue || '')].join('/')

  return result.replaceAll('//', '/')
}

function _getSameAPIEndpoint<T>(fields: NormalizedFields<T>) {
  const fieldsEntries = Object.entries<NormalizedFieldStructure>(fields)
  const sameAPIEndpoint: SameAPIEndpoint = {}
  fieldsEntries.forEach(([fieldKey, field]) => {
    if (!field.url)
      return false

    const fieldUrl = field.url
    const fieldParams = field.filterParams || {}

    let stringFieldParams = (
      new URLSearchParams(fieldParams as Record<string, string>)
    ).toString()

    stringFieldParams = stringFieldParams.split('&').sort().join('&')

    let urlTracked = fieldUrl

    if (stringFieldParams)
      urlTracked = `${fieldUrl}?${stringFieldParams}`

    const isUrlTracked = Object.prototype.hasOwnProperty.call(sameAPIEndpoint, urlTracked)

    if (!isUrlTracked)
      sameAPIEndpoint[urlTracked] = []

    sameAPIEndpoint[urlTracked].push(fieldKey)
    return true
  })

  return sameAPIEndpoint
}

export function addOptionsToField(field: NormalizedFieldStructure, data: any) {
  const options: any[] = field.options || []

  const addOptionsItems = (items: any[]) => {
    items.forEach((item) => {
      const result = options.find(option => _.isEqual(option, item))

      if (!result)
        options.push(item)
    })
  }

  if (Array.isArray(data)) {
    addOptionsItems(data)
  }
  else {
    addOptionsItems(
      getPaginationResultsKey(data),
    )
  }
  return options
}

export function getForeignKeys<T>(fields: NormalizedFields<T>): void {
  const sameAPIEndpoint: SameAPIEndpoint = _getSameAPIEndpoint(fields)

  type FieldKey = keyof typeof fields

  Object.entries(sameAPIEndpoint).forEach(([url, fieldKeys]) => {
    http.axios.get(url).then(({ data }) => {
      fieldKeys.forEach((fieldKey) => {
        fields[fieldKey as FieldKey].options = addOptionsToField(fields[fieldKey as FieldKey], data)
      })
    })
      .catch(e => console.log(e))
  })
}

export function useCreateRequest<T>(url: string, form: JSONForm | FormData, options?: CreateRequestOptions) {
  const loading = ref(false)
  const data: Ref<T | null> = ref(null)

  function triggerRequest() {
    loading.value = true
    http.axios.post(url, form)
      .then((response: AxiosResponse<T>) => {
        data.value = response.data
        onSuccess(response, options)
      })
      .catch((e) => {
        onFailed(e, options)
      })
      .finally(() => loading.value = false)
  }

  if (options?.autoTrigger !== false)
    triggerRequest()

  return {
    triggerRequest,
    data,
    loading,
  }
}

export function useUpdateRequest<T>(url: string, lookupValue: string | number, form: JSONForm | FormData, options?: UpdateRequestOptions) {
  const loading = ref(false)
  const data: Ref<T | null> = ref(null)
  const _url = buildURL({ url, lookupValue })

  function triggerRequest() {
    loading.value = true
    http.axios.post(_url, form)
      .then((response: AxiosResponse<T>) => {
        data.value = response.data
        onSuccess(response, options)
      })
      .catch((e) => {
        onFailed(e, options)
      })
      .finally(() => loading.value = false)
  }

  if (options?.autoTrigger !== false)
    triggerRequest()

  return {
    triggerRequest,
    data,
    loading,
  }
}

export function useRetrieveRequest<T>(url: string, lookupValue: string | number, options?: RetrieveRequestOptions) {
  const loading = ref(true)
  const data: Ref<T | null> = ref(null)
  const _url = buildURL({ url, lookupValue })

  function triggerRequest() {
    loading.value = true
    http.axios.get(_url)
      .then((response: AxiosResponse<T>) => {
        data.value = response.data
        onSuccess(response, options)
      })
      .catch((e) => {
        onFailed(e, options)
      })
      .finally(() => loading.value = false)
  }

  if (options?.autoTrigger !== false)
    triggerRequest()

  return {
    triggerRequest,
    data,
    loading,
  }
}

export function useDeleteRequest(url: string, lookupValue: string | number, fieldName?: string, hardDelete?: boolean, options?: DeleteRequestOptions) {
  const loading = ref(false)
  if (options?.autoTrigger !== false)
    triggerRequest()

  function requestHardDelete() {
    loading.value = true
    const _url = buildURL({ url, lookupValue })
    http.axios.delete(_url)
      .then(response => onSuccess(response, options))
      .catch(e => onFailed(e, options))
      .finally(() => loading.value = false)
  }

  function requestSoftDelete() {
    if (!fieldName)
      throw new Error('Field parameter is required when hardDelete is false')

    loading.value = true
    const _url = buildURL({ url, lookupValue })
    http.axios.patch(_url, { [fieldName]: false })
      .then(response => onSuccess(response, options))
      .catch(e => onFailed(e, options))
      .finally(() => loading.value = false)
  }

  function triggerRequest() {
    if (hardDelete)
      requestHardDelete()

    requestSoftDelete()
  }

  return {
    triggerRequest,
    loading,
  }
}

export function useListRequest<T, F = any>(url: string, filterParams?: F, pagination?: Pagination, options?: ListRequestOptions): RecordManager<T, F> {
  const loading = ref(false)
  const mutableList: Ref<T[]> = ref([])

  const _filterParams = reactive(Object.assign({}, filterParams))
  const _pagination = reactive(
    Object.assign({ page: 1, count: 10, rowsPerPage: 10 }, pagination),
  )

  const list = computed(() => mutableList.value)

  watch(() => _filterParams, () => resetPagination(), { deep: true })
  watch(() => _pagination.page, () => {
    if (options?.hotFetch !== false)
      triggerRequest(_pagination.page)
  })

  function setDataList(data: any) {
    if (Array.isArray(data)) {
      mutableList.value = data
      _pagination.count = data.length
      return
    }

    const results = getPaginationResultsKey(data)
    const count = getPaginationCountKey(data)

    mutableList.value = results
    _pagination.count = count
  }

  function resetPagination() {
    _pagination.page = 1

    if (options?.hotFetch !== false)
      triggerRequest()
  }

  function triggerRequest(page = 1) {
    loading.value = true
    const params = {
      limit: 10,
      offset: 0,
      ..._filterParams,
    }

    const offset = (page - 1) * params.limit

    if (offset > 0)
      params.offset = offset

    http.axios.get(url, { params })
      .then((response: AxiosResponse<T>) => {
        setDataList(response.data)

        if (typeof options?.onSuccess === 'function')
          options?.onSuccess(response)
      })
      .catch((e) => {
        if (typeof options?.onFailed === 'function')
          options?.onFailed(e)
      })
      .finally(() => loading.value = false)
  }

  if (options?.autoTrigger !== false)
    triggerRequest()

  return {
    triggerRequest,
    filterParams: _filterParams,
    pagination: _pagination,
    loading,
    list,
  }
}
