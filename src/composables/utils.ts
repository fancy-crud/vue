import { reactive } from 'vue'
import moment from 'moment'


export function useMenuToggle() {
  const menus: {[k: string]: any} = reactive({})

  const menuToggle = (fieldKey: string, show: boolean) => {
    if (show) menus[fieldKey].show()
    else menus[fieldKey].hide()
  }

  return {
    menus,
    menuToggle
  }

}

export function useFormats() {
  return {
    moneyFormat(value: number, currency='L', decimalPlaces=2, applyProportion=false, thousandSeparator=',', decimalSeparator='.') {
      let proportion = ''
  
      if (applyProportion) {
        if (value >= 1000000) {
          value = value / 1000000;
          proportion = ' M'
        } else if (value >= 10000 && value < 1000000) {
          value = value / 1000
          proportion = ' k'
        }
      }
    
      let result = (value/1).toFixed(decimalPlaces).replace('.', decimalSeparator)
      const resultSplitted = result.split(decimalSeparator)

      // Regex to add thousandSeparator
      const regexToSetThousand = new RegExp(`\\B(?=(\\d{3})+(?!\\d))`, 'g')

      result = `${currency}\t${resultSplitted[0].replace(regexToSetThousand, thousandSeparator)}`
      result = `${result}${decimalSeparator}${resultSplitted[1]}${proportion}`

      return result
    },
    
    percentageFormat(value: number, decimalPlaces=2) {
      const val = (value*100).toFixed(decimalPlaces).replace(',', '.')
      return val + '%'
    },
    
    dateTimeFormat(value: string) {
      return moment(value).format('YYYY-MM-DD LT')
    }
  }
}

export function useRules() {
  const requiredRule = (errorMessage?: string) => {
    const validate = (value: any): boolean | string => {
      return (!!value || value === 0) || errorMessage || 'Este campo es requerido'
    }

    return validate
  }

  const isNumberRule = (errorMessage?: string) => {
    const validate = (value: any): boolean | string => {
      const strValue = String(value)
      const isValid = !isNaN(Number(strValue))
  
      return isValid || errorMessage || 'Solo se permiten números'
    }

    return validate
  }

  const emailRule = (errorMessage?: string) => {
    const validate = (value: string): boolean | string => {
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return pattern.test(value) || errorMessage || 'Correo no válido'
    }

    return validate
  }

  const numberInRangeRule = (min: number, max: number, errorMessage?: string): ((value: string | number) => boolean | string) => {
    const validate = (value: number | string) => {
      const _value = Number(value)
      return ((!!_value || _value === 0) && _value >= min && _value <= max) || errorMessage || `Este valor debe estar entre ${min} y ${max}`
    }
    return validate
  }

  return {
    requiredRule,
    isNumberRule,
    emailRule,
    numberInRangeRule
  }
}
