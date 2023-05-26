<template>
  <div class="flex flex-nowrap p-4 items-center justify-between">
    <div>
      <slot name="table-header-prepend" />
    </div>
    <div class="flex items-center relative">
      <f-modal
        v-model="formModal"
      >
        <template #activator>
          <f-button
            @click="openCreateModal"
            :tooltip="t('create')"
            icon="mdi-plus"
          />
        </template>
        <f-modal-card
          class="p-5"
          max-width="max-w-3xl"
        >
          <f-form
            @success="fetchItems()"
            v-bind="form"
            :form="form"
            :id="props.form.id"
          >
            <template #form-header="{ title }">
              <div class="flex justify-between items-center pb-4">
                <h3 class="text-2xl">
                  {{ title }}
                </h3>
                <f-button
                  @click="closeModal"
                  text-color="text-gray-400"
                  icon="mdi-close"
                />
              </div>
            </template>
          </f-form>
        </f-modal-card>
      </f-modal>
      <f-button
        @click="exportXlsx"
        icon="mdi-microsoft-excel"
        :tooltip="t('export')"
      />
    </div>
  </div>
  <div class="overflow-x-auto p-4">
    <table class="table table-compact w-full divide-y divide-slate-100">
      <f-table-body
        @edit="openEditModal"
        @delete="deleteRecord"
        @hot-update="updateCheckbox"
        :headers="headers"
        :items="list"
      />
    </table>
    <f-progress-bar v-if="isFetching" />
  </div>

  <f-table-footer>
    <span />
    <f-pagination
      v-model="pagination.page"
      :pagination="pagination"
    />
    <p class="text-right text-sm font-bold">
      <!-- {{ itemsCount }} / {{ pagination.count }} -->
    </p>
  </f-table-footer>

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

const t = useLocale()
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
} = useTableCrud(props, emit)

const form = formManager.getForm()
const headers = computed(() => Object.values(props.columns).filter(column => !column.exclude))

// const itemsCount = computed(() => {
//   let count = (pagination.rowsPerPage) - list.value.length

//   if (count === 0)
//     count = pagination.page * pagination.rowsPerPage

//   else
//     count = pagination.count

//   return count
// })

fetchItems()

function exportXlsx() {
  // const xlsx = useXLSX(props.table)
  // xlsx.triggerRequest()
}
</script>
