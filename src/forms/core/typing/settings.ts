import type { FormModes } from '../constants'
import type { RawButton } from './buttons'
import type { RawTitle } from './titles'

export interface RawSettings {
  url: string
  lookupField?: string
  buttons?: Record<string, RawButton>
  mode?: FormModes
  title?: RawTitle
}

export interface NormalizedSettings extends Required<RawSettings> {}
