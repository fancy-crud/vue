import type { AxiosResponse } from 'axios'
import type { Form, NormalizedFieldStructure } from '@/forms'
import type { HandleRequestStatusCodes } from '@/http'

const t = useLocale()

function handleBadRequest(form: Form, data?: any) {
  pushNotification(errorNotification({
    message: t.value('server-bad-request'),
  }))

  if (!data)
    return

  type FieldKey = keyof typeof form.fields

  Object.entries(data).forEach(([fieldKey, value]) => {
    let messageError = ''
    if (Array.isArray(value) && value.length)
      messageError = value[0]

    else
      messageError = (value as string)

    if (!form.fields[fieldKey as FieldKey]) {
      if (Array.isArray(form.generalErrors))
        form.generalErrors.push(`${fieldKey} - ${messageError}`)

      else
        form.generalErrors = [`${fieldKey} - ${messageError}`]
    }
    else {
      (form.fields[fieldKey as FieldKey] as NormalizedFieldStructure).errors = [messageError]
    }
  })
}

export function handleUnauthorizedUser() {
  pushNotification(errorNotification({
    message: t.value('server-unauthorized-user'),
  }))
}

function handleUnknownError(_form: Form, _data?: any) {
  pushNotification(errorNotification({
    message: t.value('server-error'),
  }))
}

export function useHandleRequestStatusCodes(statusCodes?: HandleRequestStatusCodes) {
  const _statusCodes: HandleRequestStatusCodes = {
    400: handleBadRequest,
    500: handleUnknownError,
    401: handleUnauthorizedUser,
    ...getStatusCodesHandlers(),
  }

  if (statusCodes)
    Object.assign(_statusCodes, statusCodes)

  function getHandler(error?: AxiosResponse) {
    if (!error)
      return
    return _statusCodes[error?.status]
  }

  return {
    getHandler,
    handleBadRequest,
    handleUnknownError,
    handleUnauthorizedUser,
  }
}
