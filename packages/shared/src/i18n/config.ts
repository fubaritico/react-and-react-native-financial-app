import en from './locales/en/translation.json'
import fr from './locales/fr/translation.json'

import type { InitOptions } from 'i18next'

/** Shared i18n configuration — resources and defaults. Apps add their own plugins and call init(). */
export const i18nConfig: InitOptions = {
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
  supportedLngs: ['en', 'fr'],
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
}
