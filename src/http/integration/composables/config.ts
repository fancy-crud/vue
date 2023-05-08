import type { AxiosInstance } from 'axios'

export const httpConfig = {
  axios: {} as AxiosInstance,
  pagination: {
    results: 'results',
    count: 'count',
  },
}

export function setHttpConfig(options: unknown) {
  Object.assign(httpConfig, options)
}
