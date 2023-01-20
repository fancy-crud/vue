<template>
  <footer class="px-3">
    <slot v-bind="{ mainButton, auxButton, getLabel }">
      <f-button
        @click="mainOnClick"
        :label="getLabel(mainButton)"
        :icon="mainButton.icon"
        :class="mainButton.class"
        :disabled="!isFormValid(props.form.fields)"
      />
      <f-button
        @click="auxOnClick"
        :label="getLabel(auxButton)"
        :icon="auxButton.icon"
        :class="auxButton.class"
      />
    </slot>
  </footer>
</template>

<script lang="ts" setup>
import type { AxiosError, AxiosResponse } from 'axios'
import type { Button, Form } from '@/forms'

const props = defineProps<{
  form: Form
}>()

const emit = defineEmits<{
  (e: 'success', response: AxiosResponse): void
  (e: 'error', response?: AxiosError): void
}>()

const { isFormValid } = useRules()

const mainButton = computed(() => props.form.settings.buttons.main)
const auxButton = computed(() => props.form.settings.buttons.aux)

const getLabel = computed(() => (button: Button) => {
  return props.form.settings.mode === FormModes.CREATE_MODE ? button.label?.create : button.label?.update
})

const mainOnClick = async () => {
  if (typeof props.form.settings.buttons.main.onClick === 'function') {
    props.form.settings.buttons.main.onClick()
    return
  }

  if (props.form.settings.mode === FormModes.CREATE_MODE)
    createRequest()
  else
    updateRequest()
}

function auxOnClick() {
  if (typeof props.form.settings.buttons.aux.onClick === 'function')
    props.form.settings.buttons.aux.onClick()
}

function createRequest() {
  const { jsonForm, formData } = getFormData(props.form.fields)
  const _formData = formData || jsonForm

  useCreateRequest(props.form.settings.url, _formData, {
    onSuccess(response: AxiosResponse) {
      emit('success', response)
    },

    onFailed(error: AxiosError) {
      emit('error', error)
    },
  })
}

function updateRequest() {
  const record = props.form.record || {}
  const lookupValue = record[props.form.settings.lookupField]

  const { jsonForm, formData } = getFormData(props.form.fields)
  const _formData = formData || jsonForm

  useUpdateRequest(props.form.settings.url, lookupValue, _formData, {
    onSuccess(response: AxiosResponse) {
      emit('success', response)
    },

    onFailed(error: AxiosError) {
      emit('error', error)
    },
  })
}
</script>
