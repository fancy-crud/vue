export interface RawTablePagination {
  page?: number
  rowsPerPage?: number
  count?: number
}

export interface RawTableSetting extends Record<string, unknown> {
  url: string
  lookupField?: string
}

export interface RawTableFilter extends Record<string, unknown> {}

export interface NormalizedTablePagination extends Required<RawTablePagination> {}
