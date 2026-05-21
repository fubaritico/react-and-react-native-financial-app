import {
  Button,
  Card,
  LinkText,
  Typography,
  tw,
} from '@financial-app/ui/native'
import { useTranslation } from 'react-i18next'
import { ImageBackground, View } from 'react-native'

import { native } from './WelcomeScreen.styles'

import type { IWelcomeScreenProps } from './WelcomeScreen'

/** Welcome illustration displayed as full-screen background. */
const illustrationSource =
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@financial-app/shared/assets/illustration-welcome.png') as number

/**
 * Native implementation of the welcome screen.
 * Full-screen illustration background with a semi-transparent card overlay.
 * @param props - Screen props with get-started callback
 * @returns The welcome screen
 */
export function WelcomeScreen({ onGetStarted }: Readonly<IWelcomeScreenProps>) {
  const { t } = useTranslation()

  return (
    <ImageBackground
      source={illustrationSource}
      resizeMode="cover"
      style={tw`${native.background}`}
    >
      <View style={tw`${native.cardWrapper}`}>
        <Card style={tw`${native.card}`}>
          <Typography variant="heading-lg" align="center">
            {t('onboarding.welcome.title')}
          </Typography>
          <View style={tw`${native.descriptionWrapper}`}>
            <Typography variant="body" color="muted" align="center">
              {t('onboarding.welcome.description')}
            </Typography>
          </View>
          <View style={tw`${native.ctaWrapper}`}>
            <Button
              title={t('onboarding.welcome.getStarted')}
              onPress={onGetStarted}
              fullWidth
              centered
            />
          </View>
          <View style={tw`${native.skipWrapper}`}>
            <LinkText
              text=""
              linkLabel={t('onboarding.welcome.skip')}
              onLinkPress={onGetStarted}
            />
          </View>
        </Card>
      </View>
    </ImageBackground>
  )
}
