import type { HttpService } from '../axioma/repositories'
import type { ListRequestOptions } from '../axioma/typings'
import { onFailed, onFinally, onSuccess } from './common'

export class RequestList {
  constructor(private http: HttpService) { }

  execute(url: string, params?: Record<string, unknown>, options?: ListRequestOptions) {
    this.http.get(url, params)
      .then(response => onSuccess(response, options))
      .catch(e => onFailed(e, options))
      .finally(() => onFinally(options))
  }
}
