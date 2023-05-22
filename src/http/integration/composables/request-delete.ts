import { httpConfig } from './config'
import type { DeleteRequestOptions } from '@/http/axioma/typings'
import { RequestService } from '@/http/integration/services'
import { RequestDelete } from '@/http/foundation/request-delete'

/**
 * Hook that provides an update request functionality to update an existing resource.
 *
 * @template T The type of the response data.
 * @param {string} url The URL to which the update request will be sent.
 * @param {string | number} lookupValue The lookup value of the resource to be updated.
 * @param {JSONForm | FormData} form The form data to send in the update request.
 * @param {UpdateRequestOptions} [options] An optional object of options to customize the request behavior.
 * @returns {Object} An object containing the triggerRequest function to manually trigger the request, a reactive data property `data` that stores the response data, and a reactive boolean `loading` that indicates whether the request is currently loading or not.
 */
export function useRequestDelete(url: string, lookupValue: string | number, options?: DeleteRequestOptions) {
  const loading = ref(false)

  if (options?.autoTrigger !== false)
    triggerRequest()

  function triggerRequest() {
    loading.value = true
    const requestService = new RequestService(httpConfig)
    const requestDelete = new RequestDelete(requestService)

    requestDelete.execute(url, lookupValue, {
      ...options,
      onFinally() {
        loading.value = false
        if (typeof options?.onFinally === 'function')
          options.onFinally()
      },
    })
  }

  return {
    triggerRequest,
    loading,
  }
}
