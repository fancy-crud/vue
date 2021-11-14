import { ref, reactive, watch, onMounted, Ref } from 'vue'
import { AxiosInstance, AxiosResponse } from "axios"

import { IParams, ISameAPIEnpoint } from '@/interfaces/HTTP'
import { IForm, IFormField } from "@/interfaces/Form";
import { INotifications } from '@/interfaces/Notification'
import { IPagination, IRecords } from '@/interfaces/Table';
import { Notify } from 'quasar';


export const http = {
  axios: {} as AxiosInstance,
  notify: {} as Notify
}

export function isEquivalent(a: {[key: string]: any}, b: {[key: string]: any}): boolean {
  // Create arrays of property names
  const aProps = Object.getOwnPropertyNames(a);
  const bProps = Object.getOwnPropertyNames(b);

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length != bProps.length) {
    return false;
  }

  for (let i = 0; i < aProps.length; i++) {
    const propName = aProps[i];

    // If values of same property are not equal,
    // objects are not equivalent
    if (a[propName] !== b[propName]) {
        return false;
    }
  }

  // If we made it this far, objects
  // are considered equivalent
  return true;
}

export function buildURL(url: string, lookupValue?: string): string {
  let result: string

  if (url.endsWith('/')) {
    result = [url + lookupValue, ''].join('/')
  } else {
    result = [url, lookupValue].join('/')
  }

  return result
}

export function getForeignKeys<T>(fields: IFormField<T>): void {
  const fieldsNames = Object.keys(fields).filter(fieldKey => fields[fieldKey]['url'])
  const fieldsWithSameAPIEnpoint: ISameAPIEnpoint = {}

  fieldsNames.forEach((fieldKey: string) => {
    const field = fields[fieldKey]
    if (!Object.prototype.hasOwnProperty.call(fieldsWithSameAPIEnpoint, field['url'])) {
      fieldsWithSameAPIEnpoint[field['url']] = {
        fields: [fieldKey],
        filterParams: field['filterParams'] || {}
      }
    } else {
      if (isEquivalent(fieldsWithSameAPIEnpoint[field['url']].filterParams, field['filterParams'] || {})) {
        fieldsWithSameAPIEnpoint[field['url']].fields.push(fieldKey)
      }
    }
  })

  const fieldsWithUniqueAPIEndpoint: string[] = fieldsNames.filter(
    fieldKey => !fieldsWithSameAPIEnpoint[fields[fieldKey]['url']].fields.includes(fieldKey)
  )

  fieldsWithUniqueAPIEndpoint.forEach((fieldKey: string) => {
    const field = fields[fieldKey]
    http.axios.get(field['url'], { params: field['filterParams'] || {} })
    .then(({ data }) => {
      field['options'] = data
    }).catch(e => console.log(e.response))
  })

  Object.keys(fieldsWithSameAPIEnpoint).forEach((url: string) => {
    http.axios.get(url, { params: fieldsWithSameAPIEnpoint[url]['filterParams'] })
    .then(({ data }) => {
      fieldsWithSameAPIEnpoint[url].fields.forEach((fieldKey: string) => {
        fields[fieldKey]['options'] = data
      })
    }).catch(e => console.log(e.response))
  })
}

function handleFormError(fields: IFormField<Object>, message: {[key: string]: any} | string) {
  const fieldsKeys = Object.keys(fields)

  if (typeof message === 'object') {
    fieldsKeys.forEach(fieldKey => {
      const field = fields[fieldKey]

      if (fieldKey in message) {
        if (Array.isArray(message[fieldKey])) {
          Object.assign(field, {
            ...field,
            error: true,
            'error-message': message[fieldKey][0]
          })
        } else {
          Object.assign(field, {
            ...field,
            error: true,
            'error-message': message[fieldKey]
          })
        }
      } else if (field['url'] && `${ fieldKey }_id` in message) {
        const fieldKeyId = `${ fieldKey }_id`
        if (Array.isArray(message[fieldKeyId])) {
          Object.assign(field, {
            ...field,
            error: true,
            'error-message': message[fieldKey][0]
          })
        } else {
          Object.assign(field, {
            ...field,
            error: true,
            'error-message': message[fieldKey]
          })
        }
      } 
    })
  } 
}

export function handleRequestError(response: {status: number, data: any}): { message: string } {
  const errors: {[key: number]: any} = {
    401: { message: 'Sus credenciales de acceso han expirado' },
    404: { message: 'El elemento no existe' },
    500: { message: 'Error inesperado en el servidor' }
  }

  return errors[response.status] || { message: 'Error inesperado' }
}

export async function createRecord(url: string, form: FormData, fields: IFormField<Object>, messages: INotifications): Promise<boolean | any> {
  let response: AxiosResponse;

  try {
    response = await http.axios.post(url, form)
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      handleFormError(fields, error.response.data)
    } else {
      console.log(error)
      if (messages.error.display) {
        http.notify.create({
          ...messages.error.response,
          ...handleRequestError(error.response)
        })
      }
    }
    return false
  }

  if (messages.create.display) {
    http.notify.create(messages.create)
  }

  return response
}

export async function updateRecord<T>(url: string, form: FormData, fields?: IFormField<T>, messages?: INotifications): Promise<any> {
  let response: any
  try {
    response = await http.axios.patch(url, form)
  } catch (error: any) {
    if (fields && error.response.status === 400) {
      handleFormError(fields, error.response.data)
    } else {
      if ( messages && messages.error.display) {
        http.notify.create({
          ...messages.error.response,
          ...handleRequestError(error.response)
        })
      }
    }
    return false
  }

  if (messages && messages.update.display) {
    http.notify.create(messages.update)
  }

  return response
}

export function getRecords(url: string, initialfilterParams: IParams): IRecords {
  const search = ref('')
  const loading = ref(false)
  const filterParams = reactive(initialfilterParams)

  const list = reactive({
    unmutableItems: [] as any,
    items: [] as any,
  })

  const pagination = reactive<IPagination>({
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 10
  })

  const setDataList = (data: any) => {
    if (Array.isArray(data)) {
      list.items = data
      list.unmutableItems = data
      pagination.rowsNumber = data.length
    } else {
      list.items = data.results,
      list.unmutableItems = data.results
      pagination.rowsNumber = data.count
    }
  }

  const fetchItems = (page=1) => {
    const params = {
      limit: pagination.rowsPerPage,
      search: search.value,
      ...filterParams
    }
  
    const offset = (page - 1) * params.limit
  
    if (offset > 0) {
      params['offset'] = offset
    }

    loading.value = true
    http.axios.get(url, {
      params
    })
    .then(({ data }) => setDataList(data))
    .finally(() => loading.value = false)
  }

  onMounted(fetchItems)

  // On search is enough to restart pagination to 1
  // after that pagination.page watcher call to fetchItems
  watch(search, () => {
    if (pagination.page === 1) {
      fetchItems()
    } {
      pagination.page = 1
    }
  })

  watch(() => pagination.page, fetchItems)
  watch(filterParams, () => {
    if (pagination.page === 1) {
      fetchItems()
    } else {
      pagination.page = 1
    }
  })

  return {
    filterParams,
    pagination,
    fetchItems,
    search,
    loading,
    list
  }
}

export function retrieveRecord<T>(url: string, lookupValue: string, form: IForm<T>, retrievingRecord?: Ref<boolean>): void {
  if (retrievingRecord) retrievingRecord.value = true

  try {
    http.axios.get(buildURL(url, lookupValue)).then(({ data }) => {
      form.record = data
      if (Object.prototype.hasOwnProperty.call(form, 'dialog')) form.dialog = true
    }).finally(() => { if (retrievingRecord) retrievingRecord.value = false })
  } catch (error) {
    if (retrievingRecord) retrievingRecord.value = false
    console.error(error)
  }
}

export async function deleteRecord(url: string, lookupValue: string, hardDelete: boolean, field?: string): Promise<boolean> {
  try {
    if (hardDelete) {
      await http.axios.delete(buildURL(url, lookupValue))
    } else {
      if (field) {
        await http.axios.patch(buildURL(url, lookupValue), { [field]: false })
      } else {
        throw new Error('field parameter is required when hardDelete is set to false')
      }
    }
  } catch (error) {
    console.error(error)
    return false
  }

  return true
}

export function useHTTP() {
  return {
    getRecords,
    retrieveRecord,
    deleteRecord,
    createRecord,
    updateRecord,
  }
}
