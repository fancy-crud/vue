import type { RequestRepository } from '../axioma/repositories'
import type { JSONForm, UpdateRequestOptions } from '../axioma/typings'
import { Url } from '../axioma/value-objects'
import { onFailed, onFinally, onSuccess } from './common'

export class RequestUpdate {
  constructor(private http: RequestRepository) { }

  execute(url: string, lookupValue: string | number, form: JSONForm | FormData, options?: UpdateRequestOptions) {
    const _url = new Url(url, lookupValue)
    this.http.update(_url.value, form)
      .then(response => onSuccess(response, options))
      .catch(e => onFailed(e, options))
      .finally(() => onFinally(options))
  }
}
