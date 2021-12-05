import { parseRules, createDefaultKeys, fillFieldsWithRecordValues } from '@/composables/form'
import { useRules } from '@/composables'


describe('Tests form.ts functions', () => {

  it('Should add missing necessary keys to fields', () => {
    // [form fields to test, expected form field]
    const fields = [
      [{ name: {}}, { name: { modelValue: null, rules: [], errors: [], wasFocused: false } }]
    ]

    fields.forEach(row => {
      const field = row[0]
      const resultField = row[1]

      createDefaultKeys(field, Object.keys(field))
      expect(field).toMatchObject(resultField)
    });
  })

  it('Parsing the field string rules to Function', () => {
    const { requiredRule, isNumberRule, numberInRangeRule } = useRules()
    const  fields = [
      [
        { 
          field: {
            rules: ['required', 'isNumber', numberInRangeRule(1, 2)]
          }
        },
        {
          field: {
            rules: [requiredRule(), isNumberRule(), numberInRangeRule(1,2)]
          }
        }
      ]
    ]

    fields.forEach(item => {
      const field = item[0]
      const resultField = item[1]

      parseRules(field)
      expect(String(field)).toMatch(String(resultField))
    })
  })

  it('Should fill fields with incoming record values', () => {
    const fields = [
      [
        { stringField: {} },
        { stringField: 'Carl' },
        { stringField: { modelValue: 'Carl' } }
      ],
      [
        { stringField: {}, booleanField: { modelValue: false } },
        { stringField: 'Carl', booleanField: true },
        { stringField: { modelValue: 'Carl' }, booleanField: { modelValue: true }},
      ],
      [
        { stringField: {}, booleanField: {} },
        { stringField: 'Carl', booleanField: true },
        { stringField: { modelValue: 'Carl' }, booleanField: { modelValue: true }},
      ],
      [
        { stringField: {}, booleanField: {}, integerField: {} },
        { stringField: 'Carl', booleanField: true, integerField: 1 },
        { stringField: { modelValue: 'Carl' }, booleanField: { modelValue: true }, integerField: { modelValue: 1 }},
      ],
      [
        { stringField: {}, booleanField: {}, integerField: {} },
        { stringField: 'Carl', booleanField: true, integerField: 1 },
        { stringField: { modelValue: 'Carl' }, booleanField: { modelValue: true }, integerField: { modelValue: 1 }},
      ],
      [
        { stringField: {}, booleanField: {}, integerField: {}, selectField: {} },
        { stringField: 'Carl', booleanField: true, integerField: 1, selectField: {id: 1, name: 'A'} },
        { stringField: { modelValue: 'Carl' }, booleanField: { modelValue: true }, integerField: { modelValue: 1 }, selectField: { modelValue: {id: 1, name: 'A'} }},
      ],
    ]

    fields.forEach(([form, record, resultField]) => {
      fillFieldsWithRecordValues(form, record)
      
      Object.entries(form).forEach(([key, field]) => {
        expect(String(field.modelValue)).toMatch(String(resultField[key].modelValue))
      })
    })
  })
})
