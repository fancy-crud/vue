
import './styles/quasar.sass'
import iconSet from 'quasar/icon-set/mdi-v4.js'

import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/mdi-v4/mdi-v4.css'

import langEs from 'quasar/lang/es'
import { Notify } from 'quasar'


// To be used on app.use(Quasar, { ... })
export default {
  config: {},
  plugins: {
    Notify
  },
  lang: langEs,
  iconSet: iconSet
}