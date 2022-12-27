import type { Fields, NormalizedFields } from '@/forms'

export function useFilters<T extends Fields>(_filters: T) {
  const filters: NormalizedFields = reactive({}) as NormalizedFields

  Object.assign(filters, normalizeFormFields(_filters))

  const filterParams = reactive(
    getFormData({ fields: filters }).jsonForm,
  )

  const filterParamsStringify = computed(() => {
    return JSON.stringify(getFormData({ fields: filters }).jsonForm)
  })

  watch(filterParamsStringify, () => {
    Object.assign(filterParams, getFormData({ fields: filters }).jsonForm)
  })

  return {
    filters,
    filterParams,
    filterParamsStringify,
  }
}
