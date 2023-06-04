import type { HandleRequestStatusCodes } from '@fancy-crud/core'

const statusCodes: HandleRequestStatusCodes = {}

export function getStatusCodesHandlers() {
  return statusCodes
}

export function setStatusCodesHandlers(handlers: HandleRequestStatusCodes) {
  Object.assign(statusCodes, handlers)
}

