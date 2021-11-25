import { App, Plugin } from 'vue';

import * as components from '@/components/index';
import { http } from '@/composables/http'


// install function executed by Vue.use()
const install: Plugin = function installFancyCrud(app: App, options: any) {
  
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
export * from '@/components/index';
export * from '@/composables/utils'
export * from '@/composables/form'
export * from '@/composables/filters'
