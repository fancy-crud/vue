import 'animate.css'
import type { App, Plugin } from 'vue'

import { setHttpInstance, setHttpPagination } from '@/http'
import { setFields, setUtils } from '@/settings/composables'
import './styles/main.sass'
import type { HttpService } from '@/http/axioma/repositories'

interface Options {
  http: {
    service?: Omit<HttpService, 'pagination'>
    pagination?: HttpService['pagination']
  }
  fields: Record<string, any>
  utils: Record<string, any>
}

const components: Record<string, any> = {}
// install function executed by Vue.use()
const install: Plugin = function installFancyCrud(app: App, options: Partial<Options>) {
  const componentsList: [string, any][] = Object.entries(import.meta.glob('@/**/components/*.vue'))
  componentsList.forEach(([key, value]) => {
    if (key.includes('/viewer/'))
      return

    const componentName = key.match(/[\w]+?(?=\.)/g)

    if (componentName) {
      components[componentName[0]] = value.default
      app.component(componentName[0], value.default)
    }
  })

  if (options.http?.service)
    setHttpInstance(options.http.service)

  if (options.http?.pagination)
    setHttpPagination(options.http.pagination)

  // if (options.statusCodesHandlers)
  //   setStatusCodesHandlers(options.statusCodesHandlers)

  if (options.fields)
    setFields(options.fields)

  if (options.utils)
    setUtils(options.utils)
}

// Create module definition for Vue.use()
export default install

// To allow individual component use, export components
// each can be registered via Vue.component()
export * from './common/integration'
export * from './filters'
export * from './forms/integration'
export * from './http'
export * from './locales'
export * from './settings'
export * from './tables/integration'
