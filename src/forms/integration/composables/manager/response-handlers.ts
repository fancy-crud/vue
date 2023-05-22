export type Handler = (response: any) => void
export interface StatusCodeHandler extends Record<number, Handler> {}

const responseHandlers = new Map<symbol, StatusCodeHandler>()

export function useResponseHandler(id: symbol) {
  function getHandler() {
    if (!responseHandlers.get(id))
      responseHandlers.set(id, {})

    return responseHandlers.get(id)!
  }

  function setResponseHandler(codes: StatusCodeHandler) {
    Object.assign(getHandler(), codes)
  }

  function getResponseHandler(code: number): Handler | null {
    return getHandler()[code] || null
  }

  function removeResponseHandlers() {
    responseHandlers.delete(id)
  }

  return {
    setResponseHandler,
    getResponseHandler,
    removeResponseHandlers,
  }
}
