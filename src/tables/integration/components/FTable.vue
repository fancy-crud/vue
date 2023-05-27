<template>
  <slot name="table-header" v-bind="{ openCreateModal, exportData }">
    <f-table-header-actions @create="openCreateModal" @export="exportData" />
  </slot>

  <slot name="table-form" v-bind="{ onSuccess, form, id: props.form.id, formModal }">
    <f-modal v-model="formModal">
      <div
        class="p-5 bg-white"
        max-width="max-w-3xl"
      >
        <f-form
          @success="onSuccess"
          v-bind="form"
          :id="props.form.id"
        />
      </div>
    </f-modal>
  </slot>

  <f-table-body
    @edit="openEditModal"
    @delete="deleteRecord"
    @hot-update="updateCheckbox"
    @page-change="page => pagination.page = page"
    v-bind="$attrs"
    :headers="headers"
    :items="list"
    :loading="isFetching"
    :per-page="pagination.rowsPerPage"
    :total="pagination.count"
    pagination-position="bottom"
    backend-pagination
    paginated
  />

  <slot name="table-footer" />

  <f-delete-confirmation-modal
    v-model="confirmationModal"
    @accept="deleteRecord(rowToDelete, false)"
  >
    <template #default="{ closeModal: closeDeleteConfirmationModal }">
      <slot
        name="delete-confirmation-modal"
        v-bind="{ closeDeleteConfirmationModal }"
      />
    </template>
  </f-delete-confirmation-modal>
</template>

<script lang="ts" setup>
import _ from 'lodash'
import type { TableProps } from '@/tables/integration'
import { useTableCrud } from '@/tables/integration'

const props = defineProps<TableProps>()

const emit = defineEmits<{
  (e: 'update:formModal', value: boolean): void
}>()

const {
  openCreateModal,
  openEditModal,
  deleteRecord,
  updateCheckbox,
  closeModal,
  fetchItems,
  list,
  isFetching,
  confirmationModal,
  formManager,
  formModal,
  rowToDelete,
  pagination,
} = useTableCrud(props, emit)

const form = formManager.getForm()
const headers = computed(() => Object.values(props.columns).filter(column => !column.exclude))

fetchItems()

function exportData() {
  // const xlsx = useXLSX(props.table)
  // xlsx.triggerRequest()
}

function onSuccess() {
  fetchItems()
  closeModal()
}
</script>
