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
      <section class="row">
        <template v-for="(field, fieldKey) in availableFields" :key="fieldKey">
          <slot v-bind="{field, fieldKey}" :name="`before-${fieldKey}`"></slot>

          <section class="col-12 q-mb-md">
            <q-select
              v-if="field.inputType === 'select'"
              v-bind="fieldAttrs(field)"
              :ref="el => { if (el) field.ref = el }"
            />

            <q-input
              v-else-if="field.inputType === 'textarea'"
              v-model="field.value"
              v-bind="fieldAttrs(field)"
              :ref="el => { if (el) field.ref = el }"
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
                    :ref="el => { if (el) menus[fieldKey] = el }"
                    transition-show="scale" transition-hide="scale" >
                      <q-date v-model="field.modelValue" v-bind="field" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-input
                v-else
                v-bind="fieldAttrs(field)"
                :ref="el => { if (el) field.ref = el }"
                readonly
              />
            </template>

            <template v-else-if="field.inputType === 'file' || field.inputType === 'image'">
              <div class="row items-center">
                <div class="col-11 pr-2">
                  <q-file
                    v-bind="fieldAttrs(field)"
                    :ref="el => { if (el) field.ref = el }"
                  >
                    <template v-slot:prepend>
                      <q-icon v-if="field.inputType === 'f ile'" name="insert_drive_file" />
                      <q-icon v-else name="image" />
                    </template>
                  </q-file>
                </div>

                <div class="col-1">
                  <q-btn
                    v-if="field.inputType === 'image'"
                    @mouseenter="menuToggle(menus, fieldKey, true)"
                    @mouseleave="menuToggle(menus, fieldKey, false)"
                    :color="record[fieldKey] ? 'primary': 'grey'"
                    type="a"
                    :href="record[fieldKey]"
                    target="_blank"
                    icon="image"
                    flat
                    round
                  >
                    <q-menu :ref="el => { if (el) menus[fieldKey] = el }">
                      <q-card>
                        <img :src="record[fieldKey]">
                      </q-card>
                    </q-menu>
                  </q-btn>

                  <q-btn
                    v-else
                    type="a"
                    :href="record[fieldKey]"
                    target="_blank"
                    :color="record[fieldKey] ? 'primary': 'grey'"
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
                  :ref="el => { if (el) field.ref = el }"
                />
              </q-card-section>
            </q-card>
            
            <q-card v-else-if="field.inputType === 'radio'" flat bordered>
              <q-card-section class="py-1">
                <q-option-group
                  v-bind="fieldAttrs(field)"
                  :ref="el => { if (el) field.ref = el }"
                  type="radio"
                />
              </q-card-section>
            </q-card>
            
            <q-input
              v-else-if="field.inputType === 'password'"
              v-bind="fieldAttrs(field)"
              :ref="el => { if (el) field.ref = el }"
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
              :ref="el => { if (el) field.ref = el }"
            />
          </section>

          <slot v-bind="{field, fieldKey}" :name="`after-${fieldKey}`"></slot>
        </template>
      </section>
    </div>

    <div class="col-12">
      <slot name="form-footer" v-bind="{ buttons: form.buttons, on: { triggerCreate, triggerUpdate } }">
        <div class="row">
          <div class="col-12">
            <q-separator v-if="!form.buttons.hidden" class="q-mb-md" />
          </div>
          
          <section v-if="!form.buttons.hidden" class=".col-12 q-gutter-md" :class="form.buttons.class">
            <q-btn
              v-if="!form.buttons.main.hidden"
              v-bind="form.buttons.main"
              @click="isCreateForm ? triggerCreate() : triggerUpdate()"
              :label="mainButtonLabel"
              :disable="!form.isValid"
            />
            <q-btn
              v-if="!form.buttons.aux.hidden"
              v-bind="form.buttons.aux"
            />
          </section>
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType, computed } from 'vue'
import { IFormTitles, IFormButtons } from '@/interfaces/Form'

import { useForm, CREATE_MODE, UPDATE_MODE } from '@/composables/form'
import { useHTTP, buildURL } from '@/composables/http'

import { useMenuToggle } from '@/composables/utils'

export default defineComponent({
  name: 'FancyForm',

  props: {
    modelValue: {
      required: true,
      type: Object
    },
    url: {
      type: String,
      default: () => ''
    },
    lookupField: {
      type: String,
      default: () => 'id'
    },
    record: {
      type: Object,
      default: () => ({})
    },
    mode: {
      type: String,
      default: () => CREATE_MODE
    },
    titles: {
      type: Object as PropType<IFormTitles>,
      default: () => ({})
    },
    buttons: {
      type: Object as PropType<IFormButtons>,
      default: () => ({})
    },
    messages: {
      type: Object,
      default: () => ({})
    }
  },

  setup(props, { emit }) {
    const { form, getFormData, fieldAttrs } = useForm({
      fields: props.modelValue,
      record: props.record,
      buttons: props.buttons,
      messages: props.messages,
      mode: props.mode
    })

    const titles = reactive({
      create: 'Crear elemento',
      update: 'Actualizar elemento',
      hidden: false,
      ...props.titles
    })
  
    const { menus, menuToggle } = useMenuToggle()

    const { createRecord, updateRecord } = useHTTP()

    return {
      // Variables
      form,
      menus,

      fieldAttrs,
      menuToggle,

      isCreateForm: computed(() => props.mode === CREATE_MODE),

      title: computed(() => {
        return props.mode === CREATE_MODE ? titles.create : titles.update
      }),

      mainButtonLabel: computed(() => {
        return props.mode === CREATE_MODE ? form.buttons?.main?.createLabel : form.buttons?.main?.updateLabel
      }),

      availableFields: computed(() => { 
        return Object.fromEntries(Object.entries(form.fields).filter(([, field]) => {
          return !field.hidden && (
            (props.mode === CREATE_MODE && !field.updateOnly) ||
            (props.mode === UPDATE_MODE && !field.createOnly)
          )
        }))
      }),

    async triggerCreate() {
      const formData = getFormData()
  
      if (form.buttons.main && form.buttons.main.onClick) {
        form.buttons.main.onClick(formData)
      } else {
        const created = await createRecord(props.url, formData, form.fields, form.messages)
  
        if (created) {
          emit('created', created)
        }
      }
    },

    async triggerUpdate () {
      const formData = getFormData()

      if (form.buttons.main && form.buttons.main.onClick && typeof form.buttons.main.onClick) {
        form.buttons.main.onClick(formData)
      } else {
        const url = buildURL(props.url, props.record[props.lookupField])
        const updated = await updateRecord(url, formData, form.fields, form.messages)

        if (updated) {
          emit('updated', updated)
        }
      }
    }
    }
  }
})
</script>
