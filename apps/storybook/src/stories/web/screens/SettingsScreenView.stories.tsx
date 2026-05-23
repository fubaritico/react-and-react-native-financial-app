import { SettingsScreenView } from '@financial-app/features'

import type { ISettingsScreenViewProps } from '@financial-app/features'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

/** Token: color.beige-100 (#f8f4f0) — app background simulation */
const SCREEN_BG = '#f8f4f0'

const defaultProps: ISettingsScreenViewProps = {
  initialBalance: 40000,
  currentLanguage: 'en',
  currentCurrency: 'USD',
  onSubmit: noop,
  isSubmitting: false,
  onDeleteAccount: noop,
  isDeleting: false,
  onDisconnect: noop,
  onGoBack: noop,
}

const meta = {
  title: 'Web/Screens/SettingsScreenView',
  component: SettingsScreenView,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta
type Story = StoryObj

/** Desktop — English, two-column layout. */
export const DesktopEN: Story = {
  render: () => (
    <div style={{ minHeight: '100vh', backgroundColor: SCREEN_BG }}>
      <SettingsScreenView {...defaultProps} currentLanguage="en" />
    </div>
  ),
}

/** Desktop — French. */
export const DesktopFR: Story = {
  render: () => (
    <div style={{ minHeight: '100vh', backgroundColor: SCREEN_BG }}>
      <SettingsScreenView {...defaultProps} currentLanguage="fr" />
    </div>
  ),
}

/** Desktop — while deleting account. */
export const DesktopDeleting: Story = {
  render: () => (
    <div style={{ minHeight: '100vh', backgroundColor: SCREEN_BG }}>
      <SettingsScreenView {...defaultProps} isDeleting />
    </div>
  ),
}
