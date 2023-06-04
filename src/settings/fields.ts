import type { Component } from 'vue'

export const fields: Record<string, Component> = {}

export function setFields(newFields: unknown) {
  Object.assign(fields, newFields)
}
