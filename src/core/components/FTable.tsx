import { h } from "tsx-dom"
import { effect } from "@vue/reactivity"
import { FModal, FTableBody, FForm, FPagination } from "."
import { createHeaders, FormModes, FTableHeader, getRecords, handleErrorRequest, resetModelValue, TableAttributes, triggerCreateOrUpdate } from ".."
import _ from "lodash"
import { AxiosError, AxiosResponse } from "axios"
import { successNotification } from "../notifications"


export function FTable(props: TableAttributes) {
  let cloneForm = _.cloneDeep(props.form)

  const { list, loading, fetchItems, pagination } = getRecords({
    url: props.settings.url,
    _search: props.settings.search,
    initialFilterParams: props.settings.filterParams,
    pagination: props.settings.pagination
  })
  
  const headers = createHeaders(props.form.fields)
  const activator = <input type="checkbox" id="my-modal" class="modal-toggle" />

  const onCreate = (response: AxiosResponse<unknown>) => {
    fetchItems()
    if (typeof props.onCreate === 'function') props.onCreate(response)
  }
  
  const onUpdate = (response: AxiosResponse<unknown>) => {
    fetchItems()
    if (typeof props.onCreate === 'function') props.onCreate(response)
  }

  const mainButtonClick = async () => {
    let result: {
      isActionSucceed: boolean;
      value: any;
    }

    try {
      result = await triggerCreateOrUpdate(props.form)
    } catch (err) {
      const error = err as { value: AxiosError }
      handleErrorRequest(props.form, error.value.response)
      props.form.generalError = 'Uno o más campos presentaron errores'
      return
    }

    const onCreateOrUpdate = {
      [FormModes.CREATE_MODE]: onCreate,
      [FormModes.UPDATE_MODE]: onUpdate
    }[props.form.settings.mode]

    if (typeof onCreateOrUpdate === 'function') onCreateOrUpdate(result.value)

    successNotification()
    resetModelValue(props.form, cloneForm)
    toggleModal()
  }

  if (!props.form.settings.buttons.main.onClick) {
    props.form.settings.buttons.main.onClick = mainButtonClick
  }

  if (!props.form.settings.buttons.aux.onClick) {
    props.form.settings.buttons.aux.onClick = () => toggleModal()
  }

  const getFModal = () => {
    return (
      <FModal activator={ activator }>
        { activator }
        <div class="modal-box">
          <label for="my-modal" class="btn btn-circle absolute right-2 top-2 btn-ghost">
            <i class="mdi mdi-close text-xl"></i>
          </label>
          <FForm form={ props.form } onCreate={ onCreate }></FForm>
        </div>
      </FModal>
    )
  }

  const fmodal = getFModal()
  document.body.appendChild(fmodal)

  function toggleModal() {
    resetModelValue(props.form, cloneForm)
    ;(activator as HTMLInputElement).checked = !(activator as HTMLInputElement).checked
  }

  const table = (
    <div class="card bg-base-100 shadow-xl rounded-md">
      <div class="flex flex-nowrap p-4 items-center justify-between">
        <div>
          <input type="text" placeholder="search" class="input input-bordered" />
        </div>
        <div>
          <div class="tooltip tooltip-left" data-tip="Crear">
            <button onClick={ toggleModal } class="btn btn-circle btn-ghost modal-button">
              <i class="mdi mdi-plus text-slate-400 text-2xl"></i>
            </button>
          </div>
          <div class="tooltip tooltip-left" data-tip="Exportar">
            <button class="btn btn-circle btn-ghost">
              <i class="mdi mdi-microsoft-excel text-slate-400 text-2xl"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="overflow-x-auto p-4">
        <table class="table table-compact w-full divide-y divide-slate-100">
          <thead />
          <tbody />
        </table>
      </div>

      <div class="card-actions w-full flex flex-nowrap justify-center items-center p-4 border-t-[1px] border-slate-100">
        <tfoot></tfoot>
      </div>

      { fmodal }

    </div>
  )

  effect(() => {
    const thead = table.querySelector('thead')

    if (thead) {
      thead.replaceWith(<FTableHeader headers={ headers } loading={ loading.value } />)
    }
  })

  effect(() => {
    const tbody = table.querySelector('tbody')

    if (tbody) {
      tbody.replaceWith(<FTableBody list={ list.items } headers={ headers } />)
    }
  })

  effect(() => {
    const tfooter = table.querySelector('tfoot')

    if (tfooter) {
      tfooter.replaceWith(
        <tfoot>
          <FPagination pagination={ pagination } />
        </tfoot>
      )
    }
  })

  fetchItems()

  return table
}
