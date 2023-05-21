export type Handler = (response: any) => void
export interface StatusCodeHandler extends Record<number, Handler> {}

const handlers: Record<symbol, StatusCodeHandler> = reactive({})

export function useResponseHandler(id: symbol) {
  if (!handlers[id])
    handlers[id] = {}

  function setResponseHandler(codes: StatusCodeHandler) {
    Object.assign(handlers[id], codes)
  }

  function getResponseHandler(code: number): Handler | null {
    return handlers[id][code] || null
  }

  return {
    setResponseHandler,
    getResponseHandler,
  }
}
