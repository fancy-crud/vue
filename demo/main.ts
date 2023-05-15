import { createApp } from 'vue'
import axios from 'axios'
import '@oruga-ui/oruga-next/dist/oruga-full.css'
// import Oruga from '@oruga-ui/oruga-next'
import FancyCrud from '../src/index'
import { orugaButtons, orugaInputs } from '../src/wrappers/config'
import App from './App.vue'

import '@mdi/font/css/materialdesignicons.css'
// import 'flowbite'
import './styles/main.sass'

axios.defaults.baseURL = 'http://localhost:9000/api/'

const app = createApp(App)

// app.use(Oruga)
app.use(FancyCrud, {
  http: { axios },
  controls: {
    ...orugaInputs,
  },
  buttons: {
    ...orugaButtons,
  },
})

app.mount('#app')
