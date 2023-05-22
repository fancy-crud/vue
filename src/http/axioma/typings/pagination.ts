export interface PaginationStructure {
  results: string
  count: string
}

export interface Pagination {
  page?: number
  count?: number
  rowsPerPage?: number
}
