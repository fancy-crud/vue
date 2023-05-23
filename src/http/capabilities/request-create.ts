import type { RequestRepository } from '../axioma/repositories'
import type { CreateRequestOptions, JSONForm } from '../axioma/typings'
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
