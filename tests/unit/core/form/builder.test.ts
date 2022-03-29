import {
  createDefaultKeys,
  normalizeFormFields,
  fillFieldsWithRecordValues,
  getFormData,
} from '@/core/form'
import { NormalizedFields, Fields, NormalizedFieldStructure, FieldStructure } from '@/core/form/types'

describe('Tests for generate.ts', () => {

  it('Should generate default keys for all fields', () => {
    const fields: Array<[FieldStructure, NormalizedFieldStructure]> = [
      [
        { label: 'Input text' },
        {
          id: 'field-fieldKey0-control',
          label: 'Input text',
          type: 'text',
          rules: [],
          errors: [],
          wasFocused: false,
          modelValue: null,
          showPassword: false,
          class: 'input animation-none',
          ref: null
        }
      ],
      [
        { label: 'Input password', type: 'password' },
        {
          id: 'field-fieldKey0-control',
          label: 'Input password',
          type: 'password',
          rules: [],
          errors: [],
          wasFocused: false,
          modelValue: null,
          showPassword: false,
          class: 'input w-full animation-none',
          ref: null
        }
      ],
      [
        { label: 'Input select', type: 'select', options: [] },
        {
          id: 'field-fieldKey0-control',
          label: 'Input select',
          type: 'select',
          options: [],
          rules: [],
          errors: [],
          wasFocused: false,
          modelValue: null,
          showPassword: false,
          class: 'select',
          ref: null
        }
      ],
      [
        { label: 'Input select', type: 'select', url: 'items/' },
        {
          id: 'field-fieldKey0-control',
          label: 'Input select',
          type: 'select',
          url: 'items/',
          options: [],
          rules: [],
          errors: [],
          wasFocused: false,
          modelValue: null,
          showPassword: false,
          class: 'select',
          ref: null
        }
      ],
      [
        { label: 'Input autocomplete', type: 'autocomplete' },
        {
          id: 'field-fieldKey0-control',
          label: 'Input autocomplete',
          type: 'autocomplete',
          valueString: '',
          rules: [],
          errors: [],
          wasFocused: false,
          modelValue: null,
          showPassword: false,
          class: 'input',
          ref: null
        }
      ],
    ]
    fields.forEach(([field, normalizedField]) => {
      expect(createDefaultKeys(`fieldKey0`, field)).toEqual(normalizedField)
    })
  })

  it('Should fill fields with values from record', () => {
    const fields = [
      [
        { stringField: { modelValue: null } },
        { stringField: 'Carl' },
        { stringField: { modelValue: 'Carl' } }
      ],
      [
        { stringField: { modelValue: null }, booleanField: { modelValue: false } },
        { stringField: 'Carl', booleanField: true },
        { stringField: { modelValue: 'Carl' }, booleanField: { modelValue: true }},
      ],
      [
        { stringField: { modelValue: null }, booleanField: { modelValue: null } },
        { stringField: 'Carl', booleanField: true },
        { stringField: { modelValue: 'Carl' }, booleanField: { modelValue: true }},
      ],
      [
        { stringField: { modelValue: null }, booleanField: { modelValue: null }, integerField: { modelValue: null } },
        { stringField: 'Carl', booleanField: true, integerField: 1 },
        { stringField: { modelValue: 'Carl' }, booleanField: { modelValue: true }, integerField: { modelValue: 1 }},
      ],
      [
        { stringField: { modelValue: null }, booleanField: { modelValue: null }, integerField: { modelValue: null } },
        { stringField: 'Carl', booleanField: true, integerField: 1 },
        { stringField: { modelValue: 'Carl' }, booleanField: { modelValue: true }, integerField: { modelValue: 1 }},
      ],
      [
        { stringField: { modelValue: null }, booleanField: { modelValue: null }, integerField: { modelValue: null }, selectField: { modelValue: null } },
        { stringField: 'Carl', booleanField: true, integerField: 1, selectField: {id: 1, name: 'A'} },
        { stringField: { modelValue: 'Carl' }, booleanField: { modelValue: true }, integerField: { modelValue: 1 }, selectField: { modelValue: {id: 1, name: 'A'} }},
      ],
      [
        { selectField: { modelValue: null, url: 'artist/' } },
        { selectField: { id: 1, name: 'A' } },
        { selectField: { modelValue: { id: 1, name: 'A' } }},
      ],
      [
        { selectField: { modelValue: null, url: 'artist/', multiple: true } },
        { selectField: [{ id: 1, name: 'A' }] },
        { selectField: { modelValue: [{ id: 1, name: 'A' }] }},
      ],
      [
        { fileField: { modelValue: null, type: 'file' } },
        { fileField: 'https://file_url' },
        { fileField: { modelValue: null, fileUrl: 'https://file_url' }},
      ],
      [
        { fileField: { modelValue: null, type: 'image' } },
        { fileField: 'https://file_url' },
        { fileField: { modelValue: null, fileUrl: 'https://file_url' }},
      ],
      [
        { 'user.profile.name': { modelValue: null } },
        { user: { profile: { name: 'Carl' } } },
        { 'user.profile.name': { modelValue: 'Carl' } }
      ],
    ]

    type Result = {
      [key: string]: {
        modelValue: unknown
      }
    }

    fields.forEach(([fields, record, resultField]) => {
      const _fields: NormalizedFields = normalizeFormFields(fields as Fields)
      fillFieldsWithRecordValues(_fields, record)
      
      Object.entries(_fields).forEach(([key, field]) => {
        expect(String((field as NormalizedFieldStructure).modelValue)).toMatch(String((resultField as Result)[key].modelValue))
      })
    })
  })

  it('Should return form as JSON or FormData', () => {
    type FormTest = {
      form: { fields: NormalizedFields},
      expected: unknown,
      exception?: boolean
    }

    const formData = new FormData()
    const file = new File([], 'file.txt')

    const formDataMultipleFiles = new FormData()

    formData.append('file', file)
    formDataMultipleFiles.append('file', file)
    formDataMultipleFiles.append('file', file)
    formDataMultipleFiles.append('file', file)

    const defaultFieldValues = { errors: [], rules: [], type: 'text', ref: null, class: '' }
    const forms: Array<FormTest> = [
      {
        form: { fields: { name: { ...defaultFieldValues, modelValue: { id: 1 }, optionValue: 'id', type: 'select',  } } },
        expected: { jsonForm: { name_id: 1 }, formData: null }
      },
      {
        form: { fields: { name: { ...defaultFieldValues, modelValue: [{ id: 1 }], optionValue: 'id', type: 'select', multiple: true } } },
        expected: { jsonForm: { name_id: [1] }, formData: null }
      },
      {
        form: { fields: { name: { ...defaultFieldValues, modelValue: null, optionValue: 'id', type: 'select', multiple: true } } },
        expected: { jsonForm: { name_id: null }, formData: null }
      },
      {
        form: { fields: { name: { ...defaultFieldValues, modelValue: { id: 1 }, type: 'select', url: 'items/' } } },
        expected: "'name' field require optionValue property",
        exception: true
      },
      {
        form: { fields: { file: { ...defaultFieldValues, modelValue: file, type: 'file' } } },
        expected: { jsonForm: {}, formData }
      },
      {
        form: { fields: { file: { ...defaultFieldValues, modelValue: [file], type: 'file' } } },
        expected: { jsonForm: {}, formData }
      },
      {
        form: { fields: { file: { ...defaultFieldValues, modelValue: [file, file, file], type: 'file', multiple: true } } },
        expected: { jsonForm: {}, formData: formDataMultipleFiles }
      },
      {
        form: { fields: { name: { ...defaultFieldValues, modelValue: 'Text value' } } },
        expected: { jsonForm: { name: 'Text value' }, formData: null }
      },
      {
        form: { fields: {
          name: { ...defaultFieldValues, modelValue: 'Text value' },
          file: { ...defaultFieldValues, modelValue: file, type: 'file' } } },
        expected: { jsonForm: { name: 'Text value' }, formData }
      },
    ]

    forms.forEach(item => {
      if (item.exception) {
        try {
          getFormData(item.form)
          expect(1).toBe(0)
        } catch (error) {
          expect((error as Error).message).toBe(item.expected)
        }
      }
      else {
        const form = getFormData(item.form)
  
        expect(
          form
        ).toEqual(item.expected)
      }
    })
  })

})