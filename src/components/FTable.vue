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
      <q-input
        v-if="!hiddenSearch"
        v-model="search"
        placeholder="Buscar"
        debounce="500"
        outlined
        dense
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>

    <!-- Header actions -->
    <template v-slot:top-right>
      <slot name="left-actions"></slot>
      <q-btn
        v-if="!tableButtons.create.hidden"
        v-bind="tableButtons.create"
        @click="openCreateDialog"
      />
      <q-btn
        v-if="!tableButtons.export.hidden"
        v-bind="tableButtons.export"
        @click="handleExport"
      >
      </q-btn>
      <slot name="right-actions"></slot>
    </template>

    <template
      v-for="(field, fieldKey) in table.form.fields"
      v-slot:[`body-cell-${fieldKey}`]="props"
      :key="fieldKey"
    >
      <q-td :props="props" class="text-center">
        <slot :name="`column-${fieldKey}`" v-bind="props">
          <template v-if="field.inputType === 'image'">
            <q-btn
              @mouseenter="menuToggle(`fieldKey${fieldKey}${props.key}`, true)"
              @mouseleave="menuToggle(`fieldKey${fieldKey}${props.key}`, false)"
              :color="props.row[fieldKey] ? 'primary' : 'grey'"
              :href="props.row[fieldKey]"
              type="a"
              target="_blank"
              icon="image"
              round
              flat
            >
              <q-menu :ref="(el) => setMenu(el, `fieldKey${fieldKey}${props.key}`)">
                <div class="fancy__image-preview">
                  <img :src="props.row[fieldKey]" />
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
            <q-checkbox
              v-model="props.row[fieldKey]"
              @update:model-value="toggleCheckboxStatus(props.row, fieldKey)"
              color="primary"
            />
          </template>
          <template v-else>{{ props.value }}</template>
        </slot>
      </q-td>
    </template>

    <template v-slot:body-cell-actions="props">
      <slot name="row-actions" v-bind="props">
        <q-td>
          <q-btn
            v-if="!tableButtons.edit.hidden"
            v-bind="tableButtons.edit"
            @click="openEditDialog(props.row)"
          />
          <q-btn
            v-if="!tableButtons.remove.hidden"
            v-bind="tableButtons.remove"
            @click="handleDelete(props.row)"
          />
        </q-td>
      </slot>
    </template>

    <!-- Pagination -->
    <template v-slot:pagination>
      <q-pagination v-model="pagination.page" :max="paginationCount" input />
    </template>
  </q-table>

  <q-dialog v-model="table.form.dialog">
    <q-card>
      <q-card-section>
        <f-form
          v-model="table.form.fields"
          v-bind="table.form.settings"
          @created="onCreated"
          @updated="onUpdated"
          :record="table.form.record"
        ></f-form>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="table.retrievingRecord" persistent>
    <q-card>
      <q-card-section>
        <q-spinner color="primary" size="3em" :thickness="2" />
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="table.deleteConfirmationDialog" persistent>
    <slot name="delete-confirmation-dialog" v-bind="{ on: { triggerDelete } }">
      <q-card>
        <q-card-section>
          <span class="text-h4">Confirmación</span>
          <q-separator />
        </q-card-section>
        <q-card-section>
          Está a punto de eliminar este registro, esta acción es irreparable. <br />
          <strong>¿Seguro que desea continuar?</strong>
        </q-card-section>
        <q-card-actions>
          <q-btn @click="triggerDelete" label="Eliminar" color="negative" v-close-popup />
          <q-btn flat label="Cancelar" v-close-popup />
        </q-card-actions>
      </q-card>
    </slot>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from "vue";
import _ from 'lodash'

import { useTable, exportData } from "@/composables/table";
import { useMenuToggle } from "@/composables/utils";
import { useHTTP, buildURL } from "@/composables/http";
import { CREATE_MODE, UPDATE_MODE } from "@/composables/form";

import FForm from "./FForm.vue";

import {
  QDialog,
  QSeparator,
  QInput,
  QPopupProxy,
  QIcon,
  QCard,
  QCardSection,
  QCardActions,
  QCheckbox,
  QBtn,
  QMenu,
  QTable,
  QPagination,
  QSpinner,
  QTd,
  ClosePopup,
} from "quasar";

export default defineComponent({
  name: "FancyTable",

  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    filterParams: {
      type: Object,
      default: () => ({}),
    },
    buttons: {
      type: Object,
      default: () => ({}),
    },
    rowActions: {
      type: Boolean,
      default: () => true,
    },
    hardDelete: {
      type: Boolean,
      default: () => false,
    },
    deleteLookupField: {
      type: String,
      default: () => "id",
    },
    softDeleteField: {
      type: String,
      default: () => "is_active",
    },
    skipDeleteConfirmationDialog: {
      type: Boolean,
      default: () => false,
    },
    disableRowClick: {
      type: Boolean,
      default: () => false,
    },
    onRowAction: {
      type: Function,
      // default: () => function(){}
    },
    hiddenSearch: {
      type: Boolean,
      default: () => false,
    },
  },

  setup(props, context) {
    let originalFormFields = {};
    const http = useHTTP();

    // Used to reset form fields to initial
    // state before create dialog is open
    if (Object.keys(originalFormFields).length === 0) {
      originalFormFields = _.cloneDeep(props.modelValue.fields);
    }

    const {
      table,
      columns,
      recordsManager,
      buttons: tableButtons,
    } = useTable(props);
    const { menus, menuToggle, setMenu } = useMenuToggle();

    let recordToDelete = reactive({});

    const openCreateDialog = () => {
      table.form.fields = _.cloneDeep(originalFormFields);

      if (tableButtons.create.onClick) {
        tableButtons.create.onClick();
      } else {
        table.form.dialog = true;
        table.form.record = {};
        table.form.settings.mode = CREATE_MODE;
      }
    };

    const openEditDialog = <T>(field: T) => {
      table.form.fields = _.cloneDeep(originalFormFields);
      const lookupField = table.form.settings.lookupField
        ? String(table.form.settings.lookupField)
        : "id";

      if (tableButtons.edit.onClick) {
        tableButtons.edit.onClick(field);
      } else {
        table.form.settings.mode = UPDATE_MODE;
        http.retrieveRecord(props.url, field[lookupField], table.form);
      }
    };

    const triggerGetRecords = () => recordsManager.fetchItems();

    const triggerDelete = async () => {
      const lookupValue = String(recordToDelete[props.deleteLookupField]);
      const result = await http.deleteRecord(
        props.url,
        lookupValue,
        props.hardDelete,
        props.softDeleteField
      );

      if (result) {
        triggerGetRecords();
        context.emit("deleted", recordToDelete);
      }
    };

    const handleDelete = <T>(field: T) => {
      recordToDelete = field;

      if (props.skipDeleteConfirmationDialog) {
        triggerDelete();
      } else {
        table.deleteConfirmationDialog = true;
      }
    };

    const toggleCheckboxStatus = <T>(field: T, fieldKey: string) => {
      const lookupField = table.form.settings.lookupField
        ? String(table.form.settings.lookupField)
        : "id";
      const url = buildURL(props.url, field[lookupField]);
      const form = new FormData();

      form.set(fieldKey, String(field[fieldKey]));
      http.updateRecord(url, form);
    };

    const triggerRowAction = (event: EventTarget, row: { [key: string]: any }) => {
      event;
      if (!props.disableRowClick) {
        if (typeof props.onRowAction === "function") {
          props.onRowAction(row);
        } else {
          openEditDialog(row);
        }
      }
    };

    const handleExport = () => {
      if (typeof tableButtons.export.onClick === "function") {
        tableButtons.export.onClick();
      } else {
        // loading.value = true
        exportData(props.url, recordsManager.filterParams, table.form.fields, recordsManager.loading);
      }
    };

    const paginationCount = computed(() =>
      Math.ceil(recordsManager.pagination.rowsNumber / recordsManager.pagination.rowsPerPage)
    );

    const onCreated = () => {
      triggerGetRecords();
      table.form.dialog = false;
    };

    const onUpdated = () => {
      triggerGetRecords();
      table.form.dialog = false;
    };

    return {
      ...recordsManager,
      tableButtons,
      paginationCount,
      openCreateDialog,
      menus,
      table,
      columns,
      menuToggle,
      toggleCheckboxStatus,
      openEditDialog,

      setMenu,
      handleDelete,
      triggerDelete,
      recordToDelete,
      triggerGetRecords,
      triggerRowAction,
      handleExport,
      onCreated,
      onUpdated,
    };
  },

  components: {
    FForm,
    QDialog,
    QSeparator,
    QInput,
    QPopupProxy,
    QIcon,
    QCard,
    QCardSection,
    QCardActions,
    QCheckbox,
    QBtn,
    QMenu,
    QTable,
    QPagination,
    QSpinner,
    QTd,
  },

  directives: {
    ClosePopup,
  },
});
</script>

<style>
.q-table__bottom {
  justify-content: center !important;
}

.fancy__image-preview {
  display: flex;
  justify-content: center;
  align-content: center;
  overflow: hidden;
  max-height: 300px;
  max-width: 300px;
  width: 300px;
}

.fancy__image-preview > img {
  width: 80%;
}
</style>
