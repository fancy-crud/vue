import { h } from "tsx-dom"
import { TableHeader } from ".."
import locale from "@/locale"

interface FTableBodyAttributes {
  list: unknown[]
  headers: TableHeader[]
  onEdit: <T extends object>(row: T) => void
  onDelete?: <T extends object>(row: T) => void
}

export function FTableBody(props: FTableBodyAttributes) {
  const onEdit = props.onEdit
  const onDelete = props.onDelete

  const rowsMap = props.list.map((row, i) => {
    const values = props.headers.map((header) => {
      let value: any
      if (typeof row === "object") {
        value = (row as { [k: string]: unknown })[header.value]
      }

      if (header.field) {
        value = header.field(row, i)
      }

      if (header.format) {
        value = header.format(value)
      }

      return <td>{value}</td>
    })

    values.push(
      <td class="text-right">
        <div class="tooltip" data-tip={locale.t("Edit")}>
          <button onClick={() => onEdit(row)} class="btn btn-circle btn-ghost">
            <i class="mdi mdi-pencil text-slate-400 text-lg"></i>
          </button>
        </div>
        <div class="tooltip" data-tip={locale.t("Delete")}>
          <button onClick={() => onDelete(row)} class="btn btn-circle btn-ghost">
            <i class="mdi mdi-delete text-red-600 text-lg"></i>
          </button>
        </div>
      </td>
    )

    return <tr class="hover">{values}</tr>
  })

  return <tbody>{rowsMap}</tbody>
}
