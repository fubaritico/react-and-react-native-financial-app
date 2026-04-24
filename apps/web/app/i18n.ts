import { i18nConfig } from '@financial-app/shared/i18n'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ...i18nConfig,
    detection: {
      order: ['navigator', 'htmlTag'],
      caches: [],
    },
  })

export default i18n
