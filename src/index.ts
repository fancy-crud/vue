import 'animate.css'
// import '@oruga-ui/oruga-next/dist/oruga.min.css'
import type { App, Plugin } from 'vue'

import Oruga from '@oruga-ui/oruga-next'
import { setHttpConfig } from '@/http'
import { setButtons, setControls, setStatusCodesHandlers } from '@/settings/composables'
import './styles/main.sass'

const components: Record<string, any> = {}
// install function executed by Vue.use()
const install: Plugin = function installFancyCrud(app: App, options: any = {}) {
  app.use(Oruga)
  Object.entries(import.meta.globEager('@/**/components/*.vue')).forEach(([key, value]) => {
    if (key.includes('/viewer/'))
      return

    const componentName = key.match(/[\w]+?(?=\.)/g)

    if (componentName) {
      components[componentName[0]] = value.default
      app.component(componentName[0], value.default)
    }
  })

  if (options.http)
    setHttpConfig(options.http)

  if (options.statusCodesHandlers)
    setStatusCodesHandlers(options.statusCodesHandlers)

  if (options.controls)
    setControls(options.controls)

  if (options.buttons)
    setButtons(options.buttons)
}

// Create module definition for Vue.use()
export default install

// To allow individual component use, export components
// each can be registered via Vue.component()
export * from './common'
export * from './filters'
export * from './forms'
export * from './http'
// export * from './inputs'
export * from './locales'
export * from './notifications'
export * from './settings'
export * from './tables'
