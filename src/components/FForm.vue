<template>
  <div class="row fancy-form">
    <div class="col-12">
      <slot name="form-header" v-bind="{ title }">
        <div class="row">
          <div class="col-12 fancy-form__header py-1">
            <span class="my-0 text-h5">{{ title }}</span>
          </div>
          <div class="col-12">
            <q-separator class="q-mt-sm" />
          </div>
        </div>
      </slot>
    </div>

    <div class="col-12 q-my-md">
      <q-form @submit="onSubmit" class="row">
        <template v-for="(field, fieldKey) in availableFields" :key="fieldKey">
          <slot v-bind="{ field, fieldKey }" :name="`before-${fieldKey}`"></slot>

          <section class="col-12 q-mb-md">
            <q-select
              v-if="field.inputType === 'select'"
              v-bind="fieldAttrs(field)"
              :ref="(el) => setRef(field, el)"
            />

            <q-input
              v-else-if="field.inputType === 'textarea'"
              v-model="field.value"
              v-bind="fieldAttrs(field)"
              :ref="(el) => setRef(field, el)"
              type="textarea"
            />

            <!-- <template v-else-if="field.inputType == 'autocomplete'">
              <q-select
                v-model="field.value"
                v-bind="{ ...field, ...fieldAttrs(field) }"
                @focus="field.wasFocused = true"
                :value="field.valueString"
                :ref="el => { if (el) field.ref = el }"
                :options="field.items"
                :option-label="field.itemLabel"
                :stack-label="!!co(field.value)"
                use-chips
                hide-selected
                multiple
                use-input
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </template> -->

            <template v-else-if="field.inputType === 'date'">
              <q-input
                v-if="!field.readonly"
                v-model="field.modelValue"
                @click="menuToggle(fieldKey, true)"
                outlined
                readonly
              >
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      :ref="(el) => setMenu(el, fieldKey)"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="field.modelValue" v-bind="field" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-input
                v-else
                v-bind="fieldAttrs(field)"
                :ref="(el) => setRef(field, el)"
                readonly
              />
            </template>

            <template
              v-else-if="field.inputType === 'file' || field.inputType === 'image'"
            >
              <div class="row items-center">
                <div class="col-11 pr-2">
                  <q-file
                    v-bind="fieldAttrs(field)"
                    :ref="(el) => setRef(field, el)"
                  >
                    <template v-slot:prepend>
                      <q-icon
                        v-if="field.inputType === 'file'"
                        name="insert_drive_file"
                      />
                      <q-icon v-else name="image" />
                    </template>
                  </q-file>
                </div>

                <div class="col-1">
                  <q-btn
                    v-if="field.inputType === 'image'"
                    @mouseenter="menuToggle(fieldKey, true)"
                    @mouseleave="menuToggle(fieldKey, false)"
                    :color="record[fieldKey] ? 'primary' : 'grey'"
                    :href="record[fieldKey]"
                    target="_blank"
                    icon="image"
                    type="a"
                    flat
                    round
                  >
                    <q-menu :ref="(el) => setRef(field, el)">
                      <q-card>
                        <img :src="record[fieldKey]" />
                      </q-card>
                    </q-menu>
                  </q-btn>

                  <q-btn
                    v-else
                    type="a"
                    :href="record[fieldKey]"
                    target="_blank"
                    :color="record[fieldKey] ? 'primary' : 'grey'"
                    icon="insert_drive_file"
                    round
                    flat
                  />
                </div>
              </div>
            </template>

            <q-card v-else-if="field.inputType === 'checkbox'" flat bordered>
              <q-card-section class="py-1">
                <q-checkbox
                  v-bind="fieldAttrs(field)"
                  :ref="el => setRef(field, el)"
                />
              </q-card-section>
            </q-card>

            <q-card v-else-if="field.inputType === 'radio'" flat bordered>
              <q-card-section class="py-1">
                <q-option-group
                  v-bind="fieldAttrs(field)"
                  :ref="el => setRef(field, el)"
                  type="radio"
                />
              </q-card-section>
            </q-card>

            <q-input
              v-else-if="field.inputType === 'password'"
              v-bind="fieldAttrs(field)"
              :ref="el => setRef(field, el)"
              :type="field.showPassword ? 'text' : 'password'"
            >
              <template v-slot:append>
                <q-icon
                  :name="field.showPassword ? 'visibility' : 'visibility_off'"
                  class="cursor-pointer"
                  @click="field.showPassword = !field.showPassword"
                />
              </template>
            </q-input>

            <q-input
              v-else
              v-bind="fieldAttrs(field)"
              :ref="el => setRef(field, el)"
            />
          </section>

          <slot v-bind="{ field, fieldKey }" :name="`after-${fieldKey}`"></slot>
        </template>

        <div class="col-12">
          <slot
            name="form-footer"
            v-bind="{ buttons: form.buttons, on: { triggerCreate, triggerUpdate } }"
          >
            <div class="row">
              <div class="col-12">
                <q-separator v-if="!form.buttons.hidden" class="q-mb-md" />
              </div>

              <section
                v-if="!form.buttons.hidden"
                class=".col-12 q-gutter-md"
                :class="form.buttons.class"
              >
                <q-btn
                  v-if="!form.buttons.main.hidden"
                  v-bind="form.buttons.main"
                  :label="mainButtonLabel"
                  :disable="!form.isValid || form.buttons.main.loading"
                  type="submit"
                />
                <q-btn
                  v-if="!form.buttons.aux.hidden"
                  v-bind="form.buttons.aux"
                  :disable="form.buttons.main.loading"
                />
              </section>
            </div>
          </slot>
        </div>
      </q-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType, computed } from "vue";
import { IFormTitles, IFormButtons } from "@/interfaces/Form";

import {
  useForm,
  useMenuToggle,
  useHTTP,
  buildURL,
  CREATE_MODE,
  UPDATE_MODE,
} from "@/composables";

import {
  QSelect,
  QSeparator,
  QInput,
  QDate,
  QPopupProxy,
  QIcon,
  QFile,
  QCard,
  QCardSection,
  QCardActions,
  QCheckbox,
  QBtn,
  QOptionGroup,
  QForm,
  QMenu,
} from "quasar";

export default defineComponent({
  name: "FancyForm",

  props: {
    modelValue: {
      required: true,
      type: Object,
    },
    url: {
      type: String,
      default: () => "",
    },
    lookupField: {
      type: String,
      default: () => "id",
    },
    record: {
      type: Object,
      default: () => ({}),
    },
    mode: {
      type: String,
      default: () => CREATE_MODE,
    },
    titles: {
      type: Object as PropType<IFormTitles>,
      default: () => ({}),
    },
    buttons: {
      type: Object as PropType<IFormButtons>,
      default: () => ({}),
    },
    messages: {
      type: Object,
      default: () => ({}),
    },
  },

  setup(props, { emit }) {
    const { form, getFormData, fieldAttrs } = useForm({
      fields: props.modelValue,
      record: props.record,
      buttons: props.buttons,
      messages: props.messages,
      mode: props.mode,
    });

    const titles = reactive({
      create: "Crear elemento",
      update: "Actualizar elemento",
      hidden: false,
      ...props.titles,
    });

    const { menus, menuToggle, setMenu } = useMenuToggle();

    const { createRecord, updateRecord } = useHTTP();

    const isCreateForm = computed(() => props.mode === CREATE_MODE);

    const title = computed(() => {
      return props.mode === CREATE_MODE ? titles.create : titles.update;
    });

    const mainButtonLabel = computed(() => {
      let label = "Crear Elemento";

      if (form.buttons && form.buttons.main) {
        const createLabel = form.buttons.main.createLabel || "";
        const updateLabel = form.buttons.main.updateLabel || "";

        label = props.mode === CREATE_MODE ? createLabel : updateLabel;
      }

      return label;
    });

    const availableFields = computed(() => {
      return Object.fromEntries(
        Object.entries(form.fields).filter(([, field]) => {
          return (
            !field.hidden &&
            ((props.mode === CREATE_MODE && !field.updateOnly) ||
              (props.mode === UPDATE_MODE && !field.createOnly))
          );
        })
      );
    });

    const setRef = (field: any, _ref: any) => {
      if (_ref) {
        field.ref = _ref
      }
    }

    const triggerCreate = async () => {
      if (form.buttons.main) form.buttons.main.loading = true;
      const formData = getFormData();

      if (form.buttons.main && form.buttons.main.onClick) {
        form.buttons.main.onClick(formData);
      } else {
        const created = await createRecord(
          props.url,
          formData,
          form.fields,
          form.messages
        );

        if (created) {
          emit("created", created);
        }
      }
      if (form.buttons.main) form.buttons.main.loading = false;
    };

    const triggerUpdate = async () => {
      if (form.buttons.main) form.buttons.main.loading = true;

      const formData = getFormData();

      if (
        form.buttons.main &&
        form.buttons.main.onClick &&
        typeof form.buttons.main.onClick
      ) {
        form.buttons.main.onClick(formData);
      } else {
        const url = buildURL(props.url, props.record[props.lookupField]);
        const updated = await updateRecord(url, formData, form.fields, form.messages);

        if (updated) {
          emit("updated", updated);
        }
      }
      if (form.buttons.main) form.buttons.main.loading = false;
    };

    return {
      // Variables
      form,
      menus,

      fieldAttrs,
      menuToggle,
      setMenu,
      setRef,

      isCreateForm,
      title,
      mainButtonLabel,
      availableFields,

      triggerCreate,
      triggerUpdate,

      onSubmit() {
        isCreateForm.value ? triggerCreate() : triggerUpdate();
      },
    };
  },

  components: {
    QSelect,
    QSeparator,
    QInput,
    QDate,
    QPopupProxy,
    QIcon,
    QFile,
    QCard,
    QCardSection,
    QCardActions,
    QCheckbox,
    QBtn,
    QOptionGroup,
    QForm,
    QMenu,
  },
});
</script>
