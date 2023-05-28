import type { HttpService } from '@/http/axioma/repositories'

export const httpService: HttpService = {
  pagination: {
    results: <T>(data: any) => data.results as T[],
    count: (data: any) => data.count as number,
  },
} as HttpService

export function setHttpInstance(instance: Omit<HttpService, 'pagination'>) {
  Object.assign(httpService, instance)
}

export function setHttpPagination(pagination: HttpService['pagination']) {
  Object.assign(httpService, pagination)
}
