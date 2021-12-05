import { reactive } from 'vue'

export function useMenuToggle() {
  const menus: {[k: string]: any} = reactive({})

  const menuToggle = (fieldKey: string, show: boolean) => {
    if (show) menus[fieldKey].show()
    else menus[fieldKey].hide()
  }

  const setMenu = (el: any, fieldKey: string) => {
    if (el) menus[fieldKey] = el
  }

  return {
    menus,
    menuToggle,
    setMenu
  }
}
