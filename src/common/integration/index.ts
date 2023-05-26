import FButton from './components/FButton.vue'

export function exportComponents() {
  const components: Record<string, any> = import.meta.globEager('./**/*.vue')

  const exportable: any = {}

  function getName(key: string) {
    return key.substring(location.pathname.lastIndexOf('/') + 2).split('.vue')[0]
  }

  Object.entries(components).forEach(([key, value]) => {
    const keyName: string = value.name ? value.name : getName(key)

    if (keyName.includes('FButton'))
      return

    exportable[keyName] = value.default
  })
}

export {
  FButton,
}
export default exportComponents()
