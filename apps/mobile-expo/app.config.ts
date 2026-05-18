import type { ExpoConfig, ConfigContext } from 'expo/config'

import appJson from './app.json'

const baseConfig = appJson.expo as unknown as ExpoConfig

export default ({ config }: ConfigContext): ExpoConfig => {
  const isProduction = process.env.APP_ENV === 'production'

  return {
    ...config,
    ...baseConfig,
    android: {
      ...baseConfig.android,
      ...(!isProduction && { usesCleartextTraffic: true }),
    },
  }
}
