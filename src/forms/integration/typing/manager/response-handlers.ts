export type Handler = (response: any) => void
export interface StatusCodeHandler extends Record<number, Handler> {}
