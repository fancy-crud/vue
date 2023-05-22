import type { PaginationStructure } from '../typings'

export class PaginateResult<T> {
  private _results: T[]
  private _count: number

  constructor(private paginationStructure: PaginationStructure, data: T) {
    this._results = this.getPaginationResults(data)
    this._count = this.getPaginationCount(data)
  }

  private getPaginationResults(data: any) {
    const splittedKey = this.paginationStructure.results.split('.')
    return splittedKey.reduce((accum, key) => accum[key], data)
  }

  private getPaginationCount(data: any) {
    const splittedKey = this.paginationStructure.count.split('.')
    return splittedKey.reduce((accum, key) => accum[key], data)
  }

  get results() {
    return this._results
  }

  get count() {
    return this._count
  }
}
