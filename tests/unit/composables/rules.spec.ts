// import { shallowMount } from '@vue/test-utils'
import { useRules } from '@/composables/utils'

describe('Tests to useRules functions', () => {
  const messageError = 'In error case message'
  const {
    requiredRule,
    isNumberRule,
    emailRule,
    numberInRangeRule
  } = useRules()

  it('Test to requiredRule', () => {
    const validValues = [true, 'Some typed value', 0, 123]

    const valuesToRaiseMessageError = ['', null, undefined, false]
    
    valuesToRaiseMessageError.forEach(value => {
      expect(typeof requiredRule()(value)).toMatch('string')
      expect(requiredRule(messageError)(value)).toMatch(messageError)
    })

    validValues.forEach(value => expect(typeof requiredRule()(value)).toMatch('boolean'))
  })

  it('Test to isNumberRule', () => {
    const validValues = [123, -12, 0, 10.2, '2', '3', '1.2']

    const valuesToRaiseMessageError = [null, undefined, false, '.', ',', 'a', '1,2']

    valuesToRaiseMessageError.forEach(value => {
      expect(typeof isNumberRule()(value)).toMatch('string')
      expect(isNumberRule(messageError)(value)).toMatch(messageError)
    })

    validValues.forEach(value => expect(typeof isNumberRule()(value)).toMatch('boolean'))
  })

  it('Test to emailRule', () => {
    const validValues = ['example@gmail.com', 'example@hotmail.com', 'example123@outlook.com']

    const valuesToRaiseMessageError = [
      'example.com',
      'correo',
      'example@gmail',
      'vale@gmail.'
    ]

    valuesToRaiseMessageError.forEach(value => {
      expect(typeof emailRule()(value)).toMatch('string')
      expect(emailRule(messageError)(value)).toMatch(messageError)
    })

    validValues.forEach(value => expect(typeof emailRule()(value)).toMatch('boolean'))
  })

  it('Test to numberInRangeRule', () => {
    // [min, max, validNumber]
    const validValues = [
      [1, 2, 1],
      [10, 10, 10],
      [0, 0.5, 0.3],
      [-23, -1, -19]
    ]

    const valuesToRaiseMessageError = [
      [1, 2, 2.01],
      [10, 10, 11],
      [0, 0.5, -1]
    ]

    valuesToRaiseMessageError.forEach(value => {
      expect(typeof numberInRangeRule(value[0], value[1])(value[2])).toMatch('string')
      expect(numberInRangeRule(value[0], value[1], messageError)(value[2])).toMatch(messageError)
    })

    validValues.forEach(value => expect(typeof numberInRangeRule(value[0], value[1])(value[2])).toMatch('boolean'))
  })


})
