import { h } from "tsx-dom"

import axios, { AxiosResponse } from 'axios'
import { createTable, http } from '@/core'

import { createForm } from '@/core'
import { FTable } from '@/core/components'

axios.defaults.baseURL = 'http://localhost:9000/api/'
http.axios = axios

const form = createForm({
  id: 'formulario',
  fields: {
    name: {
      label: 'Nombre',
      placeholder: 'Nombre de usuario',
      class: 'input-bordered',
      rules: ['required'],
    },
    gender: {
      label: 'Género',
      placeholder: 'Nombre de usuario',
      class: 'input-bordered',
      rules: ['required'],
      table: {
        label: 'Sexo',
      }
    },
    // image: {
    //   label: 'Imagen',
    //   type: 'image',
    // },
    created_at: {
      label: 'Fecha creación',
      class: 'input-bordered',
      rules: ['required'],
      updateOnly: true
    },
    updated_at: {
      label: 'Ultima actualizacion',
      class: 'input-bordered',
      rules: ['required'],
      updateOnly: true
    },
  },
  settings: {
    url: 'artists/',
  }
})

const table = createTable({
  form,
  settings: {
    url: form.settings.url,
    pagination: {
      rowsPerPage: 2
    }
  }
})

const ftable = <FTable form={ table.form } settings={ table.settings } onCreate={(response: AxiosResponse) => console.log(response)} />

document.body.appendChild(ftable)
