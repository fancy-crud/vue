import { h } from "tsx-dom"
import { TableHeader } from "..";

interface FTableBodyAttributes {
  list: unknown[];
  headers: TableHeader[];
}

export function FTableBody(props: FTableBodyAttributes) {
  const rowsMap = props.list.map((row, i) => {
    const values = props.headers.map(header => {
      let value: any
      if (typeof row === 'object') {
        value = (row as { [k: string]: unknown })[header.value]
      }

      if (header.field) {
        value = header.field(row, i)
      }

      if (header.format) {
        value = header.format(value)
      }

      return (<td>{ value }</td>)
    })

    values.push(
      <td class="text-right">
        <div class="tooltip" data-tip="Editar">
          <button class="btn btn-circle btn-ghost">
            <i class="mdi mdi-pencil text-slate-400 text-lg"></i>
          </button>
        </div>
        <div class="tooltip" data-tip="Eliminar">
          <button class="btn btn-circle btn-ghost">
            <i class="mdi mdi-delete text-red-600 text-lg"></i>
          </button>
        </div>
      </td>
    )

    return (
      <tr class="hover">
        { values }
      </tr>
    )
  })
  
  return (
    <tbody>
      { rowsMap }
    </tbody>
  )
}