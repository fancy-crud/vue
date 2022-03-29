import axios from 'axios'

import {
  http,
  createRecord,
  updateRecord,
  retrieveRecord,
  deleteRecord,
  buildURL,
  getForeignKeys,
  // getRecords
} from '@/core/http'

import { NormalizedFields, NormalizedFieldStructure } from '@/core/form'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Testing getRecords from requests.ts', () => {
  // beforeEach(() => {
  //   mockedAxios.get.mockImplementation(() => {
  //     return Promise.resolve({ data: [1,2,3,4,5] })
  //   })
  
  //   http.axios = mockedAxios
  // })

  // it('Should simulate fetch items on filterParams modify', async () => {
  //   const { filterParams, list } = getRecords({ url: 'items/' })
  //   expect(list.items).toEqual([])

  //   Object.assign(filterParams, { value : {
  //     country_id: 1
  //   }})
 
  //   const promise = new Promise((resolve) => {
  //     setTimeout(() => resolve(true), 20)
  //   })

  //   await promise

  //   expect(list.items).toEqual([1,2,3,4,5])
  // })
  
  // it('Should simulate fetch items on search modify', async () => {
  //   const { search, list } = getRecords({ url: 'items/' })
  //   expect(list.items).toEqual([])

  //   search.value = 'Honduras'
 
  //   const promise = new Promise((resolve) => {
  //     setTimeout(() => resolve(true), 20)
  //   })

  //   await promise

  //   expect(list.items).toEqual([1,2,3,4,5])
  // })
  
  // it('Check for loading value on fetchItems request', async () => {
  //   const { loading, fetchItems } = getRecords({ url: 'items/' })
  //   expect(loading.value).toBeFalsy()

  //   mockedAxios.get.mockImplementation(() => {
  //     expect(loading.value).toBeTruthy()
  //     return Promise.resolve({ data: [1,2,3,4,5] })
  //   })

  //   http.axios = mockedAxios

  //   fetchItems()
 
  //   const promise = new Promise((resolve) => {
  //     setTimeout(() => resolve(true), 20)
  //   })

  //   await promise

  //   expect(loading.value).toBeFalsy()
  // })

  // it('Check for pagination reset on filterParams and search modify', () => {
  //   const { pagination, filterParams, search } = getRecords({ url: 'items/' })
    
  //   pagination.page = 5
  //   expect(pagination.page).toBe(5)

  //   filterParams.value = { value: 'test' }
  //   expect(pagination.page).toBe(1)

  //   pagination.page = 11
  //   expect(pagination.page).toBe(11)

  //   search.value = 'searchValue'
  //   expect(pagination.page).toBe(1)
  // })
  
  // it('Check pagination rowsPerPage modify', () => {
  //   const { pagination } = getRecords({ url: 'items/' })
    
  //   pagination.rowsPerPage = 5
  //   expect(pagination.rowsPerPage).toBe(5)
  // })
  
  // it('Check pagination rowsNumber after fetchItems', async () => {
  //   const { pagination } = getRecords({ url: 'items/' })
    
  //   pagination.page = 5

  //   const promise = new Promise((resolve) => {
  //     setTimeout(() => resolve(true), 20)
  //   })

  //   await promise

  //   expect(pagination.rowsNumber).toBe(5)
  // })
  
  // it('Check if unmutedItems are not affected after modify items in list', async () => {
  //   const { list, fetchItems } = getRecords({ url: 'items/' })
    
  //   fetchItems()

  //   const promise = new Promise((resolve) => {
  //     setTimeout(() => resolve(true), 20)
  //   })

  //   await promise

  //   list.items.push(6)

  //   expect(list.unmutedItems).toEqual([1,2,3,4,5])
  // })
  
  // it('Check list assignation on paginated results', async () => {
  //   const { list, fetchItems } = getRecords({ url: 'items/' })

  //   mockedAxios.get.mockImplementationOnce(() => {
  //     return Promise.resolve({ data: {
  //       results: [1,2,3,4,5],
  //       count: 5
  //     }})
  //   })

  //   http.axios = mockedAxios

  //   fetchItems()

  //   const promise = new Promise((resolve) => {
  //     setTimeout(() => resolve(true), 20)
  //   })

  //   await promise

  //   expect(list.items).toEqual([1,2,3,4,5])
  // })
  
  // it('Check list assignation on paginated deep results', async () => {
  //   const { list, fetchItems } = getRecords({ url: 'items/' })

  //   mockedAxios.get.mockImplementationOnce(() => {
  //     return Promise.resolve({ data: {
  //       count: 5,
  //       pagination: {
  //         results: {
  //           items: [1,2,3,4,5],
  //         }
  //       }
  //     }})
  //   })

  //   http.axios = mockedAxios
  //   http.pagination.results = 'pagination.results.items'

  //   fetchItems()

  //   const promise = new Promise((resolve) => {
  //     setTimeout(() => resolve(true), 20)
  //   })

  //   await promise

  //   expect(list.items).toEqual([1,2,3,4,5])
  // })
})

describe('Testing http requests.ts', () => {
  it('Should create a valid url for requests', () => {
    const urlTesting = [
      { args: { url: 'items' }, expect: 'items/'},
      { args: { url: 'items/' }, expect: 'items/'},
      { args: { url: 'items/', lookupValue: 2 }, expect: 'items/2/'},
      { args: { url: 'items/', lookupValue: 'id' }, expect: 'items/id/'},
      { args: { url: 'items/', lookupValue: 'id/' }, expect: 'items/id/'},
      { args: { url: 'items/', lookupValue: '/id/' }, expect: 'items/id/'},
    ]

    urlTesting.forEach(item => {
      expect(
        buildURL(item.args)
      ).toBe(item.expect)
    })
  })

  it('Should fetch records from url', async () => {
    const countries = {
      values: [1,2,3,4,5,6,7,8,9],
      matchCounter: 0,
      unmatchCounter: 0
    }

    const filterCountries = {
      values: [1,2,3,4,5],
      matchCounter: 0,
      unmatchCounter: 0
    }

    mockedAxios.get.mockImplementation((url) => {
      let data: any[] = []

      switch (url) {
        case 'countries/':
          data = countries.values
          countries.matchCounter += 1
          break
        case 'countries/?id=4':
          data = filterCountries.values
          filterCountries.matchCounter += 1
          break
        case 'countries/?id=4&name=Honduras':
          data = filterCountries.values
          filterCountries.unmatchCounter += 1
          break
        case 'countries/?id=4&name=New+Zealand':
          data = filterCountries.values
          filterCountries.unmatchCounter += 1
          break
      }

      return Promise.resolve({ data })
    })

    http.axios = mockedAxios

    const fields: NormalizedFields = {
      countries1: {
        url: 'countries/',
        type: 'select',
        modelValue: null,
        errors: [],
        rules: [],
        expect: countries.values,
        class: 'select',
        ref: null
      },
      countries2: {
        url: 'countries/',
        type: 'select',
        modelValue: null,
        errors: [],
        rules: [],
        class: 'select',
        ref: null,
        expect: countries.values
      },
      countries3: {
        url: 'countries/',
        filterParams: {
          id: 4
        },
        type: 'select',
        modelValue: null,
        errors: [],
        rules: [],
        class: 'select',
        ref: null,
        expect: filterCountries.values
      },
      countries4: {
        url: 'countries/',
        filterParams: {
          id: 4
        },
        type: 'select',
        modelValue: null,
        errors: [],
        rules: [],
        class: 'select',
        ref: null,
        expect: filterCountries.values
      },
      countries5: {
        url: 'countries/',
        filterParams: {
          name: 'Honduras',
          id: 4,
        },
        type: 'select',
        modelValue: null,
        errors: [],
        rules: [],
        class: 'select',
        ref: null,
        expect: filterCountries.values
      },
      countries6: {
        url: 'countries/',
        filterParams: {
          id: 4,
          name: 'New Zealand'
        },
        type: 'select',
        modelValue: null,
        errors: [],
        rules: [],
        class: 'select',
        ref: null,
        expect: filterCountries.values
      }
    }

    const promise = new Promise((resolve) => {
      getForeignKeys(fields)
      setTimeout(() => resolve(true), 20)
    })

    await promise

    Object.values(fields as NormalizedFields).forEach((field: NormalizedFieldStructure) => {
      expect(field.options).toEqual(field.expect)
      
      expect(countries.matchCounter).toBe(1)
      expect(filterCountries.matchCounter).toBe(1)
      expect(filterCountries.unmatchCounter).toBe(2)
    })
  })

  it('Should simulate success create request', async () => {
    mockedAxios.post.mockImplementationOnce((_, data) => {
      return Promise.resolve({ data })
    })

    http.axios = mockedAxios

    const form = {
      id: 1,
      value1: 1,
      valu2: 2
    }
    
    const response = { isActionSucceed: true, value: { data: form } }

    const args = {
      url: 'items/',
      form
    }
    await expect(createRecord(args)).resolves.toEqual(response)
  })

  it('Should simulate error create request', async () => {
    mockedAxios.post.mockImplementationOnce(() => {
      return Promise.reject({ error: 'Testing error message' })
    })

    http.axios = mockedAxios

    const form = {
      id: 1,
      value1: 1,
      valu2: 2
    }
    
    const response = { isActionSucceed: false, value: { error: 'Testing error message' } }

    const args = {
      url: 'items/',
      form
    }

    await expect(createRecord(args)).rejects.toEqual(response)
  })

  it('Should simulate success update request', async () => {
    mockedAxios.patch.mockImplementationOnce((_, data) => {
      return Promise.resolve({ data })
    })

    http.axios = mockedAxios

    const form = {
      id: 1,
      value1: 1,
      valu2: 2
    }
    
    const response = { isActionSucceed: true, value: { data: form } }

    const args = {
      url: 'items/',
      lookupValue: 1,
      form
    }
    await expect(updateRecord(args)).resolves.toEqual(response)
  })

  it('Should simulate error update request', async () => {
    mockedAxios.patch.mockImplementationOnce(() => {
      return Promise.reject({ error: 'Testing error message' })
    })

    http.axios = mockedAxios

    const form = {
      id: 1,
      value1: 1,
      valu2: 2
    }
    
    const response = { isActionSucceed: false, value: { error: 'Testing error message' } }

    const args = {
      url: 'items/',
      lookupValue: 1,
      form
    }

    await expect(updateRecord(args)).rejects.toEqual(response)
  })

  it('Should simulate success retrieve request', async () => {
    mockedAxios.get.mockImplementationOnce(() => {
      const _form = {
        id: 1,
        value1: 1,
        valu2: 2
      }
      return Promise.resolve({ data: _form })
    })
    
    http.axios = mockedAxios
    
    const form = {
      id: 1,
      value1: 1,
      valu2: 2
    }
    
    const response = { isActionSucceed: true, value: { data: form } }

    const args = {
      url: 'items/',
      lookupValue: 1,
    }

    await expect(
      retrieveRecord(args)
    ).resolves.toEqual(response)
  })

  it('Should simulate error retrieve request', async () => {
    mockedAxios.get.mockImplementationOnce(() => {
      return Promise.reject({ error: 'Testing error message' })
    })

    http.axios = mockedAxios

    const response = { isActionSucceed: false, value: { error: 'Testing error message' } }

    const args = {
      url: 'items/',
      lookupValue: 1
    }

    await expect(retrieveRecord(args)).rejects.toEqual(response)
  })
  
  it('Should simulate success soft delete request', async () => {
    const form = {
      id: 1,
      value1: 1,
      valu2: 2
    }

    mockedAxios.patch.mockImplementationOnce(() => {
      return Promise.resolve({ data: form })
    })
    
    http.axios = mockedAxios
    
    const response = { isActionSucceed: true, value: { data: form } }

    const args = {
      url: 'items/',
      lookupValue: 1,
      field: 'is_active'
    }

    await expect(
      deleteRecord(args)
    ).resolves.toEqual(response)
  })

  it('Should simulate error soft delete request', async () => {
    const form = {
      id: 1,
      value1: 1,
      valu2: 2
    }

    mockedAxios.patch.mockImplementationOnce(() => {
      return Promise.reject({ data: form })
    })
    
    http.axios = mockedAxios
    
    const response = { isActionSucceed: false, value: { data: form } }

    const args = {
      url: 'items/',
      lookupValue: 1,
      field: 'is_active'
    }

    await expect(
      deleteRecord(args)
    ).rejects.toEqual(response)
  })
  
  it('Should throw exception on delete request', async () => {
    const args = {
      url: 'items/',
      lookupValue: 1,
    }

    await expect(
      deleteRecord(args)
    ).rejects.toThrowError()
  })

  it('Should simulate success hard delete request', async () => {
    const form = {
      id: 1,
      value1: 1,
      valu2: 2
    }

    mockedAxios.delete.mockImplementationOnce(() => {
      return Promise.resolve({ data: form })
    })
    
    http.axios = mockedAxios
    
    const response = { isActionSucceed: true, value: { data: form } }

    const args = {
      url: 'items/',
      lookupValue: 1,
      hardDelete: true
    }

    await expect(
      deleteRecord(args)
    ).resolves.toEqual(response)
  })
  
  it('Should simulate error hard delete request', async () => {
    const form = {
      id: 1,
      value1: 1,
      valu2: 2
    }

    mockedAxios.delete.mockImplementationOnce(() => {
      return Promise.reject({ data: form })
    })
    
    http.axios = mockedAxios
    
    const response = { isActionSucceed: false, value: { data: form } }

    const args = {
      url: 'items/',
      lookupValue: 1,
      hardDelete: true
    }

    await expect(
      deleteRecord(args)
    ).rejects.toEqual(response)
  })
})
