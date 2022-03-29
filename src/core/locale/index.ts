import i18n from 'roddeh-i18n'

import en from './en.json'
import es from './es.json'

const locales: { [k: string]: unknown } = {
  en,
  es
}

type Translator = (v: string) => string

const locale: { lang: string, t: Translator } = {
  lang: 'en',
  t: (_: string) => _
}

const t = i18n.create(locales[locale.lang])
locale.t = t

export {
  locale as default,
  locales
}