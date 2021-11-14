import { App, Plugin } from 'vue';

import { QCard, QCardSection } from 'quasar/src/components/card'
import { QSelect } from 'quasar/src/components/select'
import { QSeparator } from 'quasar/src/components/separator'

// Import vue components
import { QInput } from 'quasar/src/components/input'
import { QDate } from 'quasar/src/components/date'
import { QPopupProxy } from 'quasar/src/components/popup-proxy'
import { QIcon } from 'quasar/src/components/icon'
import { QFile } from 'quasar/src/components/file'
import { QMenu } from 'quasar/src/components/menu'
import { QBtn } from 'quasar/src/components/btn'
import { QCheckbox } from 'quasar/src/components/checkbox'
import { QOptionGroup } from 'quasar/src/components/option-group'

import * as components from '@/components/index';
import { http } from '@/composables/http'


// install function executed by Vue.use()
const install: Plugin = function installFancyCrud(app: App, options: any) {
// const install = function installFancyCrud(app: App, options: any) {

  app.component('q-card', QCard)
  app.component('q-card-section', QCardSection)
  app.component('q-select', QSelect)
  app.component('q-separator', QSeparator)
  app.component('q-input', QInput)
  app.component('q-date', QDate)
  app.component('q-popup-proxy', QPopupProxy)
  app.component('q-icon', QIcon)
  app.component('q-file', QFile)
  app.component('q-menu', QMenu)
  app.component('q-btn', QBtn)
  app.component('q-checkbox', QCheckbox)
  app.component('q-option-group', QOptionGroup)
  
  Object.entries(components).forEach(([componentName, component]) => {
    app.component(componentName, component);
  });

  if (options.axios) {
    http.axios = options.axios
  }

  if (options.Notify) {
    http.notify = options.Notify
  }
};

// Create module definition for Vue.use()
export default install;

// To allow individual component use, export components
// each can be registered via Vue.component()
// export * from '@/components/index';
export * from '@/composables/utils'
export * from '@/composables/form'
export * from '@/composables/filters'
