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
