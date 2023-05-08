import type { RequestRepository } from '../core/repositories'
import type { ListRequestOptions } from '../core/typings'
import { onFailed, onFinally, onSuccess } from './common'

export class RequestList {
  constructor(private http: RequestRepository) { }

  execute(url: string, params?: Record<string, unknown>, options?: ListRequestOptions) {
    this.http.list(url, params)
      .then(response => onSuccess(response, options))
      .catch(e => onFailed(e, options))
      .finally(() => onFinally(options))
  }
}
