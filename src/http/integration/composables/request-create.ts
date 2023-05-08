import { httpConfig } from './config'
import type { CreateRequestOptions, JSONForm } from '@/http/core/typings'
import { RequestService } from '@/http/integration/services'
import { RequestCreate } from '@/http/foundation'

/**
 * Hook for sending an HTTP POST request to create a resource on the server.
 * @param url The URL to which the request will be sent.
 * @param form The form or data to be sent in the request.
 * @param options Additional options to customize the request.
 * @returns An object with the `triggerRequest` function to send the request,
 * the `data` variable to store the server's response, and the `loading` variable
 * to indicate whether the request is in progress.
 */
export function useRequestCreate(url: string, form: JSONForm | FormData, options?: CreateRequestOptions) {
  if (options?.autoTrigger !== false)
    triggerRequest()

  function triggerRequest() {
    const requestService = new RequestService(httpConfig)
    const requestCreate = new RequestCreate(requestService)
    requestCreate.execute(url, form, options)
  }

  return {
    triggerRequest,
  }
}
