import { i18nConfig } from '@financial-app/shared/i18n'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLocales } from 'react-native-localize'

const deviceLng = getLocales()[0]?.languageCode

void i18n.use(initReactI18next).init({
  ...i18nConfig,
  lng: deviceLng,
})

export default i18n
