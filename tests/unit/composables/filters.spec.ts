import 'regenerator-runtime/runtime'
import { isReactive, nextTick } from 'vue'
import { IFilters } from '@/interfaces/Filters'
import { useFilters, http } from '@/composables'
import axios from 'axios'
// import moxios from 'moxios'

describe('Tests filters.ts', () => {
  http.axios = axios

  http.axios.get = jest.fn().mockImplementation(() => {
    return Promise.resolve(
      {status: 200, data: [
        {id: 1, country: 'New Zealand'},
        {id: 2, country: 'Honduras'},
        {id: 3, country: 'Australia'},
        {id: 4, country: 'Irlanda'},
      ]}
    )
  })

  const _filters: IFilters = {
    country: {
      label: 'Country',
      optionLabel: 'name',
      optionValue: 'id',
      url: 'countries/',
    }
  }

  const { filters, plainFilters } = useFilters(_filters)

  it('Keep initial filters unedited', () => {
    expect(_filters)
  })

  it('Should to return reactive filters', () => {
    expect(isReactive(filters)).toBeTruthy()
  })

  it('Should to generate missing keys', () => {
    Object.values(filters).forEach(filter => {
      ['options', 'modelValue'].forEach(key => {
        expect(Object.prototype.hasOwnProperty.call(filter, key)).toBeTruthy()
      })
    })
  })

  it('Should to generate initial plainFilters', (done) => {
    // filters.country.modelValue = { id: 1, name: 'New Zealand' }

    nextTick(() => {
      expect(plainFilters).toMatchObject({ country: '' })
      done()
    })
  })
  
  it('Should to refresh plainFilters object', () => {
    const valuesToTest = [
      { id: 1, name: 'Honduras' },
      { id: 2, name: 'New Zealand' },
      { id: 3, name: 'Canada' },
      { id: 4, name: 'Australia' },
    ]
    
    expect.assertions(valuesToTest.length)

    valuesToTest.forEach(async (value) => {
      filters.country.modelValue = value
      
      await nextTick()
      expect(plainFilters).toMatchObject({ country: String(value.id) })
    })
  })
})
