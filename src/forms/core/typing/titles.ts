export interface RawTitle {
  create?: string
  update?: string
}

export interface NormalizedTitle extends Required<RawTitle> {}
