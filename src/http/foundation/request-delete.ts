import type { RequestRepository } from '../core/repositories'
import type { DeleteRequestOptions } from '../core/typings'
import { Url } from '../core/value-objects'
import { onFailed, onFinally, onSuccess } from './common'

export class RequestDelete {
  constructor(private http: RequestRepository) { }

  execute(url: string, lookupValue: string | number, options?: DeleteRequestOptions) {
    const _url = new Url(url, lookupValue)
    this.http.delete(_url.value)
      .then(response => onSuccess(response, options))
      .catch(e => onFailed(e, options))
      .finally(() => onFinally(options))
  }
}
