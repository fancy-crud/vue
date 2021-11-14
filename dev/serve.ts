import { createApp } from 'vue';
import Dev from './serve.vue';
// To register individual components where they are used (serve.vue) instead of using the
// library as a whole, comment/remove this import and it's corresponding "app.use" call
import axios from './plugins/axios'
import { Quasar, Notify } from 'quasar'

import "quasar/dist/quasar.sass"
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'

// import quasarUserOptions from './quasar-user-options'
import FancyCrud from '../src/entry.esm';

const app = createApp(Dev);

app.use(Quasar, {});

app.use(FancyCrud, { axios, Notify });

app.mount('#app');
