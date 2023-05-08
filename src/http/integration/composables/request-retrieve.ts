import { httpConfig } from './config'
import type { RetrieveRequestOptions } from '@/http/core/typings'
import { RequestService } from '@/http/integration/services'
import { RequestRetrieve } from '@/http/foundation'

/**
 * Hook to retrieve data from an API using the HTTP GET method with a lookup value.
 *
 * @template T The type of the data to be retrieved.
 * @param {string} url The URL of the API endpoint to retrieve data from.
 * @param {(string | number)} lookupValue The lookup value to filter the data with.
 * @param {RetrieveRequestOptions} [options] Additional options for the HTTP request.
 * @returns {{triggerRequest: () => void, loading: Ref<boolean>}} An object containing a function to trigger the request and a reactive boolean indicating if the request is in progress.
 */
export function useRetrieveRequest(url: string, lookupValue: string | number, options?: RetrieveRequestOptions) {
  const loading = ref(true)

  if (options?.autoTrigger !== false)
    triggerRequest()

  function triggerRequest() {
    loading.value = true

    const requestService = new RequestService(httpConfig)
    const requestRetrieve = new RequestRetrieve(requestService)

    requestRetrieve.execute(url, lookupValue, {
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
