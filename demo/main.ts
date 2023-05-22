import { createApp } from 'vue'
import '@oruga-ui/oruga-next/dist/oruga-full.css'
// import Oruga from '@oruga-ui/oruga-next'
import FancyCrud from '../src/index'
import { buttons, fields } from '../src/wrappers/config'
import _axios from './modules/axios'
import App from './App.vue'

import '@mdi/font/css/materialdesignicons.css'
// import 'flowbite'
import './styles/main.sass'

const app = createApp(App)

// app.use(Oruga)
app.use(FancyCrud, {
  http: { axios: _axios },
  controls: {
    ...fields,
  },
  buttons: {
    ...buttons,
  },
})

app.mount('#app')
