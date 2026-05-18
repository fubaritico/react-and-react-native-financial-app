import { ModeCard, Typography } from '@financial-app/ui/web'
import i18n from 'i18next'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

/** Token: color.beige-100 (#f8f4f0) — app background simulation */
const SCREEN_BG = '#f8f4f0'

/**
 * Mode choice cards as displayed in the onboarding flow (web).
 * @returns Title + Manual card + Bank card (disabled) with responsive layout
 */
const ModeChoiceContent = () => (
  <div
    style={{
      minHeight: '100vh',
      backgroundColor: SCREEN_BG,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
    }}
  >
    <div style={{ width: '100%', maxWidth: 800 }}>
      <Typography variant="heading-lg" as="h1" align="center">
        {i18n.t('onboarding.modeChoice.title')}
      </Typography>
      <div
        style={{
          marginTop: 32,
          display: 'flex',
          flexDirection: 'row',
          gap: 24,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: '1 1 320px', maxWidth: 380 }}>
          <ModeCard
            icon="manual"
            title={i18n.t('onboarding.modeChoice.manualTitle')}
            description={i18n.t('onboarding.modeChoice.manualDescription')}
            onPress={noop}
          />
        </div>
        <div style={{ flex: '1 1 320px', maxWidth: 380 }}>
          <ModeCard
            icon="bank"
            title={i18n.t('onboarding.modeChoice.bankTitle')}
            description={i18n.t('onboarding.modeChoice.bankDescription')}
            disabled
            badge={i18n.t('onboarding.modeChoice.comingSoon')}
            onPress={noop}
          />
        </div>
      </div>
    </div>
  </div>
)

const meta = {
  title: 'Web/Screens/ModeChoiceScreen',
  component: ModeCard,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    icon: 'manual',
    title: '',
    description: '',
    onPress: noop,
  },
} satisfies Meta<typeof ModeCard>

export default meta
type Story = StoryObj<typeof meta>

/** Desktop — cards side by side. */
export const Desktop: Story = {
  render: () => <ModeChoiceContent />,
}

/** Mobile — cards stacked (resize browser to see). */
export const Mobile: Story = {
  render: () => <ModeChoiceContent />,
}
