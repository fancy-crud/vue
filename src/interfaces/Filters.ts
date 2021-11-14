export interface IFilters {
  [key: string]: {
    label: string,
    optionLabel: string,
    optionValue: string,
    value?: string | number | boolean
    options?: Array<{[key: string]: string | number | boolean}>,
    url?: string,
    filterParams?: {[key: string]: string | number | boolean}
    [key: string]: any
  }
}