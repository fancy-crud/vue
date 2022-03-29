import { h } from "tsx-dom"
import { TableHeader } from "..";

interface FTableHeaderAttributes {
  headers: TableHeader[];
  loading?: boolean
}

export function FTableHeader(props: FTableHeaderAttributes) {
  const { headers, loading } = props
  const headersElements = headers.map(header => {
    return <th class="text-slate-400 bg-base-100 normal-case">{ header.label }</th>
  })

  const preloader = <tr class="relative w-full left-0 top-0 h-1 rounded preloader" />

  if (headers.length) {
    headersElements[0].setAttribute('style', 'border-bottom-left-radius: 0px')
  }

  headersElements.push(
    <th class="bg-base-100 normal-case" style="border-bottom-right-radius: 0px" />
  )

  return (
    <thead class="w-full">
      <tr>
        { headersElements }
      </tr>
      { loading ? preloader : null }
    </thead>
  )
}