import { useFormats } from '@/composables/utils'

describe('Tests to useRules functions', () => {
  const { moneyFormat, percentageFormat, dateTimeFormat } = useFormats()

  it('Test to moneyFormat', () => {
    const values = [
      {
      value: 10.3579, result: 'L\t10.36', currency: 'L', decimalPlaces: 2,
      applyProportion: false, thousandSeparator: ',', decimalSeparator: '.'
    },{
      value: 10.4239, result: '$\t10,4239', currency: '$', decimalPlaces: 4,
      applyProportion: false, thousandSeparator: '.', decimalSeparator: ','
    },{
      value: -10.4239, result: '$\t-10,4239', currency: '$', decimalPlaces: 4,
      applyProportion: false, thousandSeparator: '.', decimalSeparator: ','
    },{
      value: 10239, result: '$\t10,239.00', currency: '$', decimalPlaces: 2,
      applyProportion: false, thousandSeparator: ',', decimalSeparator: '.'
    },{
      value: 100239.3454, result: '$\t100,239.3454', currency: '$', decimalPlaces: 4,
      applyProportion: false, thousandSeparator: ',', decimalSeparator: '.'
    },{
      value: 100239.3454, result: '$\t100.2 k', currency: '$', decimalPlaces: 1,
      applyProportion: true, thousandSeparator: ',', decimalSeparator: '.'
    },{
      value: 1100239.3454, result: '$\t1.10 M', currency: '$', decimalPlaces: 2,
      applyProportion: true, thousandSeparator: ',', decimalSeparator: '.'
    },{
      value: 1100239.3454, result: '$\t1.10 M', currency: '$', decimalPlaces: 2,
      applyProportion: true, thousandSeparator: ',', decimalSeparator: '.'
    }]

    values.forEach(item => {
      expect(
        moneyFormat(
          item.value,
          item.currency,
          item.decimalPlaces,
          item.applyProportion,
          item.thousandSeparator,
          item.decimalSeparator,
        )
      ).toMatch(item.result)
    })
  })

  it('Test to percentageFormat', () => {
    const  values = [
      { value: 0.2, result: '20.00%' },
      { value: 0.01, result: '1.00%' },
      { value: 0.2467, result: '24.67%' },
      { value: 0.2467, result: '24.67%' },
      { value: 0.24678, decimalPlaces: 2, result: '24.68%' },
      { value: 0.24678, decimalPlaces: 3, result: '24.678%' },
      { value: -0.24678, decimalPlaces: 3, result: '-24.678%' },
    ]

    values.forEach(item => expect(percentageFormat(item.value, item.decimalPlaces)).toMatch(item.result))
  })

  it('Test to dateTimeFormat', () => {
    const  values = [
      { value: '2021-10-23', result: '2021-10-23' },
      { value: '2021-10-23 13:09', result: '2021-10-23 1:09 PM' },
      { value: '2021-10', result: '2021-10-01 12:00 AM' },
    ]

    values.forEach(item => expect(dateTimeFormat(item.value)).toMatch(item.result))
  })
})
