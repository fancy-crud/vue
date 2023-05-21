import type { FormModes } from '../constants'

export interface RawSetting {
  url?: string
  lookupField?: string
  lookupValue?: string
  mode?: FormModes
  disableResponseHandlers?: boolean
  disableNotifications?: boolean
}

export interface NormalizedSettings extends Required<Omit<RawSetting, 'lookupValue'>> {
  lookupValue?: string
}
