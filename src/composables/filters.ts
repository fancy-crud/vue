import { reactive, watch } from "vue";
import { IFilters } from "../interfaces/Filters"
import { getForeignKeys } from './http'


export function setupFilters(filters: IFilters) {
  const filtersKeys = Object.keys(filters)

  filtersKeys.forEach(filterKey => {
    const filter = filters[filterKey]

    if (!Object.prototype.hasOwnProperty.call(filter, 'options')) {
      filter['options'] = []
    }

    if (!Object.prototype.hasOwnProperty.call(filter, 'modelValue')) {
      filter['modelValue'] = ''
    }
  });

  getForeignKeys(filters)
}

export function useFilters(_filters: IFilters) {
  const filters = reactive(JSON.parse(JSON.stringify(_filters)) as IFilters)
  const plainFilters = reactive({} as {[key: string]: any})

  setupFilters(filters)

  const refreshPlainFilters = () => {
    Object.keys(filters).forEach((filterKey: string) => {
      const filter = filters[filterKey]
      if (filter.modelValue) {
        plainFilters[filterKey] = String(filter.modelValue[filter.optionValue] || '')
      } else {
        plainFilters[filterKey] = ''
      }
    })
  }

  refreshPlainFilters()
  watch(filters, refreshPlainFilters)

  return {
    filters,
    plainFilters
  }
}
