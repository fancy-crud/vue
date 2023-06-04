import type { Component } from 'vue'

export const table: Record<'body', Component> = {
  body: {},
}

export function setTable(newTable: unknown) {
  Object.assign(table, newTable)
}
