import type { AxiosInstance, AxiosResponse } from 'axios'
import type { RequestRepository } from '@/http/core/repositories'
import type { JSONForm } from '@/http/core/typings'

export class RequestService implements RequestRepository {
  constructor(private http: { axios: AxiosInstance }) {}

  create(url: string, form: JSONForm | FormData): Promise<AxiosResponse<any, any>> {
    return this.http.axios.post(url, form)
  }

  retrieve(url: string): Promise<AxiosResponse<any, any>> {
    return this.http.axios.get(url)
  }

  update(url: string, form: JSONForm | FormData): Promise<AxiosResponse<any, any>> {
    return this.http.axios.patch(url, form)
  }

  delete(url: string): Promise<unknown> {
    return this.http.axios.delete(url)
  }

  list(url: string, params: Record<string, unknown>): Promise<AxiosResponse<any, any>> {
    return this.http.axios.get(url, { params })
  }
}
