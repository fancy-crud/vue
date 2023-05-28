import type { HttpService } from '../axioma/repositories'
import type { RetrieveRequestOptions } from '../axioma/typings'
import { Url } from '../axioma/value-objects'
import { onFailed, onFinally, onSuccess } from './common'

export class RequestRetrieve {
  constructor(private http: HttpService) { }

  execute(url: string, lookupValue: string | number, options?: RetrieveRequestOptions) {
    const _url = new Url(url, lookupValue)
    this.http.get(_url.value)
      .then(response => onSuccess(response, options))
      .catch(e => onFailed(e, options))
      .finally(() => onFinally(options))
  }
}
