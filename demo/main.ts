import { createApp } from 'vue'
import axios from 'axios'
import Oruga from '@oruga-ui/oruga-next'
import FancyCrud from '../src/index'
import App from './App.vue'

import '@mdi/font/css/materialdesignicons.css'
import 'flowbite'
import '@oruga-ui/oruga-next/dist/oruga.css'
import './styles/main.sass'

axios.defaults.baseURL = 'http://localhost:9000/api/'

const app = createApp(App)

app.use(Oruga)
app.use(FancyCrud, {
  http: { axios },
})

app.mount('#app')
