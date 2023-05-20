<template>
  <form
    class="f-form"
  >
    <f-form-header v-slot="{ title }" :titles="props.titles" :settings="props.settings">
      <slot name="form-header" v-bind="{ title }" />
    </f-form-header>

    <!-- <f-form-body :fields="props.fields" :settings="props.settings" :style="insetScrollStyles"> -->
    <f-form-body :fields="props.fields" :settings="props.settings" :form-id="props.id">
      <template
        v-for="([slotName]) in beforeAndAfterFieldSlots"
        #[`${slotName}`]
        :key="slotName"
      >
        <slot :name="slotName" />
      </template>
    </f-form-body>

    <f-form-footer
      @main-click="onMainClick(onSuccess, onFailed)"
      @aux-click="onAuxClick"
      :buttons="props.buttons"
      :settings="props.settings"
      :is-form-valid="isFormValid"
    />

    <f-notification-group>
      <f-notification
        v-for="(notification, i) in notifications"
        @dismiss="shiftNotification"
        v-bind="notification"
        :key="i"
        class="mb-4"
      />
    </f-notification-group>
  </form>
</template>

<script lang="ts" setup>
import _ from 'lodash'
import type { AxiosError, AxiosResponse } from 'axios'
import { useCreateOrUpdateRecord } from '../composables'
import type { NormalizedSettings, NormalizedTitles, ObjectWithNormalizedButton, ObjectWithNormalizedFields } from '@/forms/core'
import { FormModes } from '@/forms/core'

const props = defineProps<{
  id: symbol
  fields: ObjectWithNormalizedFields
  titles: NormalizedTitles
  buttons: ObjectWithNormalizedButton
  settings: NormalizedSettings
  noInsetScroll?: boolean
}>()

const emit = defineEmits<{
  (e: 'success', response: AxiosResponse): void
  (e: 'error', response?: AxiosError): void
}>()

const { isFormValid } = useRules(props.fields)
const slots = useSlots()
const t = useLocale()
const { execute: onMainClick } = useCreateOrUpdateRecord(props.fields, props.buttons, props.settings)
// const { getHandler } = useHandleRequestStatusCodes(props.form.settings.statusCodesHandlers)

const notifications = computed(() => notificationStore.value)

const beforeAndAfterFieldSlots = computed(() => {
  return Object.entries(slots).filter(
    ([slotName]) => slotName.startsWith('before-') || slotName.startsWith('after-'),
  )
})

const successNotificationMessage = computed(() => {
  const messages = {
    [FormModes.CREATE_MODE]: t.value('element-created'),
    [FormModes.UPDATE_MODE]: t.value('element-updated'),
  }
  return messages[props.settings.mode]
})

// const insetScrollStyles = computed(() => {
//   return !props.noInsetScroll ? { maxHeight: '70vh', overflow: 'hidden auto' } : {}
// })

function onSuccess(response: AxiosResponse) {
  pushNotification({
    ...successNotification(),
    message: successNotificationMessage.value,
  })

  // const handler = getHandler(response)

  // if (handler)
  //   handler(props.form, response.data)

  emit('success', response)
}

function onFailed(error?: AxiosError) {
  pushNotification({
    ...errorNotification(),
    message: 'errorNotificationMessage.value',
  })
  // const handler = getHandler(error?.response)

  // if (handler)
  //   handler(props.form, error?.response?.data)

  emit('error', error)
}

function onAuxClick() {
  if (typeof props.buttons.aux.onClick === 'function')
    props.buttons.aux.onClick()
}
</script>
