import type { RequestRepository } from '../core/repositories'
import type { CreateRequestOptions, JSONForm } from '../core/typings'
import { onFailed, onFinally, onSuccess } from './common'

export class RequestCreate {
  constructor(private http: RequestRepository) { }

  execute(url: string, form: JSONForm | FormData, options?: CreateRequestOptions) {
    this.http.create(url, form)
      .then(response => onSuccess(response, options))
      .catch(e => onFailed(e, options))
      .finally(() => onFinally(options))
  }
}
