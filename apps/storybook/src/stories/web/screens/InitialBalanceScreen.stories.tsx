import { InitialBalanceScreen } from '@financial-app/features'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const defaultProps = {
  onSubmit: noop,
  onBack: noop,
  isSubmitting: false,
  error: '',
}

const meta = {
  title: 'Web/Screens/InitialBalanceScreen',
  component: InitialBalanceScreen,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta
type Story = StoryObj

/** Desktop — initial balance screen (idle). */
export const Desktop: Story = {
  render: () => <InitialBalanceScreen {...defaultProps} />,
}

/** Desktop — submitting state (button disabled + loading text). */
export const Submitting: Story = {
  render: () => <InitialBalanceScreen {...defaultProps} isSubmitting />,
}

/** Desktop — server error displayed. */
export const WithError: Story = {
  render: () => (
    <InitialBalanceScreen
      {...defaultProps}
      error="Initial balance has already been set"
    />
  ),
}
