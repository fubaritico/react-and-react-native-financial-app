import { InitialBalanceScreen } from '@financial-app/features'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const meta = {
  title: 'Web/Screens/InitialBalanceScreen',
  component: InitialBalanceScreen,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onSubmit: noop,
    onBack: noop,
    isSubmitting: false,
    error: '',
  },
} satisfies Meta<typeof InitialBalanceScreen>

export default meta
type Story = StoryObj<typeof meta>

/** Desktop — initial balance screen (idle). */
export const Desktop: Story = {
  render: (args) => <InitialBalanceScreen {...args} />,
}

/** Desktop — submitting state (button disabled + loading text). */
export const Submitting: Story = {
  args: { isSubmitting: true },
  render: (args) => <InitialBalanceScreen {...args} />,
}

/** Desktop — server error displayed. */
export const WithError: Story = {
  args: { error: 'Initial balance has already been set' },
  render: (args) => <InitialBalanceScreen {...args} />,
}
