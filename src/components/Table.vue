<template>
  <q-table
    @row-dblclick="triggerRowAction"
    :columns="columns"
    :rows="list.items"
    :loading="loading"
    :rows-per-page-options="[10]"
  >
    <!-- Search input -->
    <template v-slot:top-left>
      <q-input v-if="!hiddenSearch" v-model="search" placeholder="Search" debounce="500" outlined dense>
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>

    <!-- Header actions -->
    <template v-slot:top-right>
      <slot name="left-actions"></slot>
      <q-btn
        v-if="!_buttons.create.hidden"
        v-bind="_buttons.create"
        @click="openCreateDialog"
      />
      <q-btn
        v-if="!_buttons.export.hidden"
        v-bind="_buttons.export"
        @click="handleExport"
      >
      </q-btn>
      <slot name="right-actions"></slot>
    </template>

    <template v-for="(field, fieldKey) in table.form.fields" v-slot:[`body-cell-${fieldKey}`]="props" :key="fieldKey">
      <q-td :props="props" class="text-center">
        <slot :name="`column-${fieldKey}`" v-bind="props">
          <template v-if="field.inputType === 'image'">
            <q-btn
              @mouseenter="menuToggle(menus, `fieldKey${props.key}`, true)"
              @mouseleave="menuToggle(menus, `fieldKey${props.key}`, false)"
              :color="props.row[fieldKey] ? 'primary' : 'grey'"
              :href="props.row[fieldKey]"
              type="a"
              target="_blank"
              icon="image"
              round
              flat
            >
              <q-menu :ref="el => { if (el) menus[`fieldKey${props.key}`] = el }">
                <div class='fancy__image-preview'>
                  <img :src="props.row[fieldKey]">
                </div>
              </q-menu>
            </q-btn>
          </template>
          <template v-else-if="field.inputType === 'file'">
            <q-btn
              :color="props.row[fieldKey] ? 'primary' : 'grey'"
              :href="props.row[fieldKey]"
              type="a"
              target="_blank"
              icon="description"
              round
              flat
            >
            </q-btn>
          </template>
          <template v-else-if="field.inputType === 'checkbox'">
            <q-checkbox v-model="props.row[fieldKey]" @update:model-value="toggleCheckboxStatus(props.row, fieldKey)" color="primary" />
          </template>
          <template v-else>{{ props.value }}</template>
        </slot>
      </q-td>
    </template>

    <template v-slot:body-cell-actions="props">
      <slot name="row-actions" v-bind="props">
        <q-td>
          <q-btn
            v-if="!_buttons.edit.hidden"
            v-bind="_buttons.edit"
            @click="openEditDialog(props.row)"
          />
          <q-btn
            v-if="!_buttons.remove.hidden"
            v-bind="_buttons.remove"
            @click="handleDelete(props.row)"
          />
        </q-td>
      </slot>
    </template>

    <!-- Pagination -->
    <template v-slot:pagination>
      <q-pagination
      v-model="pagination.page"
      :max="paginationCount"
      input
    />
    </template>
  </q-table>

  <q-dialog v-model="table.form.dialog">
    <f-form
      v-model="table.form.fields"
      v-bind="table.form.settings"
      @created="() => { triggerGetRecords(); table.form.dialog = false }"
      @updated="() => { triggerGetRecords(); table.form.dialog = false }"
      :record="table.form.record"
    ></f-form>
  </q-dialog>

  <q-dialog v-model="retrievingRecord" persistent>
    <q-card>
      <q-card-section>
        <q-spinner
          color="primary"
          size="3em"
          :thickness="2"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="deleteConfirmationDialog" persistent>
    <q-card>
      <q-card-section>
        <slot name="delete-confirmation-dialog-title">
          <q-separator />
        </slot>
      </q-card-section>
      <q-card-section>
        <slot name="delete-confirmation-dialog-title">
          Está a punto de eliminar este registro, esta acción es irreparable. <br>
          ¿Seguro que desea continuar?
        </slot>
      </q-card-section>
      <q-card-actions>
        <q-btn @click="triggerDelete" label="Eliminar" color="negative" v-close-popup />
        <q-btn flat label="Cancelar" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, readonly } from 'vue'
import FForm from './FForm.vue'

import { IColumn } from '@/interfaces/Table'
import { IFormField } from '@/interfaces/Form'
import { useMenuToggle } from '@/composables/utils'
import { useHTTP } from '@/composables/http'
import { setupColumns, setupButtons, setupExportData } from '@/composables/useTableSetup'

let originalFormFields = {}

export default defineComponent({
  name: 'FancyTable',

  components: {
    FForm
  },

  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    url: {
      type: String,
      required: true
    },
    filterParams: {
      type: Object,
      default: () => ({})
    },
    buttons: {
      type: Object,
      default: () => ({})
    },
    rowActions: {
      type: Boolean,
      default: () => true
    },
    hardDelete: {
      type: Boolean,
      default: () => false
    },
    deleteLookupField: {
      type: String,
      default: () => 'id'
    },
    softDeleteField: {
      type: String,
      default: () => 'is_active'
    },
    skipDeleteConfirmationDialog: {
      type: Boolean,
      default: () => false
    },
    disableRowClick: {
      type: Boolean,
      default: () => false
    },
    onRowAction: {
      type: Function,
      // default: () => function(){}
    },
    hiddenSearch: {
      type: Boolean,
      default: () => false
    }
  },

  setup(props, context) {
    const http = useHTTP(props, context.emit, )
    // Used to reset form fields to initial
    // state before create dialog is open
    if (Object.keys(originalFormFields).length === 0) {
      originalFormFields = readonly(JSON.parse(JSON.stringify(props.modelValue.form.fields)))
    }

    const table = reactive(props.modelValue)
    if (!Object.prototype.hasOwnProperty.call(table.form, 'dialog')) {
      table.form.dialog = false
    }

    // Check if form has settings.buttons.aux.onClick
    // if isn't it, is created and then add function
    // to close form dialog
    ['settings', 'buttons', 'aux', 'onClick'].reduce((aux, current) => {
      let result: any;
      if (aux[current]) {
        result = aux[current]
      } else {
        aux[current] = {}
        result = aux[current]
      }
      return result
    }, table.form)

    if (!(typeof table.form.settings.buttons.aux.onClick === 'function')) {
      table.form.settings.buttons.aux.onClick = () => table.form.dialog = false
    }

    const _buttons = reactive(setupButtons(props.buttons))
    const { menus, menuToggle } = useMenuToggle()
    const retrievingRecord = ref(false)

    const deleteConfirmationDialog = ref(false)
    let recordToDelete = reactive<IFormField>({})

    const columns: IColumn[] = reactive(setupColumns(table.form.fields, props.rowActions))

    const records = http.getRecords(props.url, props.filterParams)

    const openCreateDialog = () => {
      table.form.fields = JSON.parse(JSON.stringify(originalFormFields))

      if (_buttons.create.onClick) {
        _buttons.create.onClick()
      } else {
        table.form.dialog = true
        table.form.record = {}
        table.form.settings.isCreateForm = true
      }
    }

    const openEditDialog = (field: IFormField) => {
      const lookupField = table.form.settings.lookupField ? String(table.form.settings.lookupField) : 'id'

      if (_buttons.edit.onClick) {
        _buttons.edit.onClick(lookupField)
      } else {
        table.form.settings.isCreateForm = false
        http.retrieveRecord(props.url, field[lookupField], table.form, retrievingRecord)
      }
    }

    const triggerGetRecords = () => records.fetchItems()

    const triggerDelete = async () => {
      const lookupValue = String(recordToDelete[props.deleteLookupField])
      const result = await http.deleteRecord(props.url, lookupValue, props.hardDelete, props.softDeleteField)

      if (result) {
        triggerGetRecords()
        context.emit('deleted', recordToDelete)
      }
    }

    const handleDelete = (field: IFormField) => {
      recordToDelete = field

      if (props.skipDeleteConfirmationDialog) {
        triggerDelete()
      } else {
        deleteConfirmationDialog.value = true
      }
    }

    const toggleCheckboxStatus = (field: IFormField, fieldKey: string) => {
      const lookupField = table.form.settings.lookupField ? String(table.form.settings.lookupField) : 'id'
      const form = new FormData()
      form.set(fieldKey, String(field[fieldKey]))

      http.updateRecord(props.url, field[lookupField], form)
    }

    const triggerRowAction = (event: EventTarget, row: {[key: string]: any}) => {
      if (!props.disableRowClick) {
        if (typeof props.onRowAction === 'function') {
          props.onRowAction(row)
        } else {
          openEditDialog(row)
        }
      }
    }

    const handleExport = () => {
      if (typeof _buttons.export.onClick === 'function') {
        _buttons.export.onClick()
      } else {
        // loading.value = true
        setupExportData(props.url, records.filterParams, table.form.fields, records.loading)
      }
    }

    const paginationCount = computed(() => Math.ceil(
      records.pagination.rowsNumber / records.pagination.rowsPerPage
    ))

    return {
      ...records,
      _buttons,
      paginationCount,
      openCreateDialog,
      menus,
      table,
      columns,
      menuToggle,
      toggleCheckboxStatus,
      openEditDialog,
      retrievingRecord,
      deleteConfirmationDialog,
      handleDelete,
      triggerDelete,
      recordToDelete,
      triggerGetRecords,
      triggerRowAction,
      handleExport,
    } 
  }
})
</script>

<style lang="sass" scoped>
.q-table__bottom
  justify-content: center !important

.fancy__image-preview
  display: flex
  justify-content: center
  align-content: center
  overflow: hidden
  max-height: 300px
  max-width: 300px
  width: 300px
  img
    width: 80%
    // height: 300px
</style>