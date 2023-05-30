import { i18n as defaultI18n } from '@fancy-crud/core'

interface Locale {
  locale: string
  messages: Record<string, Record<string, string>>
}

export const i18n: Locale = reactive(defaultI18n)

export function setLocale(locale: Locale) {
  Object.assign(i18n, locale)
}

export function useLocale() {
  const t = computed(() => {
    return (text: string) => i18n.messages[i18n.locale][text] || text
  })

  return t
}
