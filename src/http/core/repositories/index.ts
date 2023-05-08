import type { JSONForm } from '../typings'

export interface RequestRepository {
  create(url: string, form: JSONForm | FormData): Promise<unknown>
  retrieve(url: string): Promise<unknown>
  update(url: string, form: JSONForm | FormData): Promise<unknown>
  delete(url: string): Promise<unknown>
  list(url: string, params?: Record<string, unknown>): Promise<unknown>
}
