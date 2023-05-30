import { RequestUpdate, httpService } from '@fancy-crud/core'
import type { JSONForm, UpdateRequestOptions } from '@fancy-crud/core'

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
export function useRequestUpdate(url: string, lookupValue: string | number, form: JSONForm | FormData, options?: UpdateRequestOptions) {
  const loading = ref(false)

  if (options?.autoTrigger !== false)
    triggerRequest()

  function triggerRequest() {
    loading.value = true

    const update = new RequestUpdate(httpService)
    update.execute(url, lookupValue, form, {
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
