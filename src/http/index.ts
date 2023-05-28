import { exportComponents } from '@/common/integration'

export * from './integration/composables'
export * from './axioma/typing'

export default exportComponents(import.meta.glob('./**/*.vue'))
