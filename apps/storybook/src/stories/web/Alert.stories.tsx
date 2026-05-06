import { Alert } from '@financial-app/ui'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Web/Design System/Molecules/Alert',
  component: Alert,
  argTypes: {
    severity: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info'],
    },
    message: { control: 'text' },
  },
  args: {
    severity: 'success',
    message: 'Operation completed successfully.',
  },
  parameters: {
    backgrounds: 'white',
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}

/** All 4 severity levels. */
export const Showcase: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        maxWidth: 500,
      }}
    >
      <Alert severity="success" message="Transaction saved successfully." />
      <Alert severity="warning" message="Your budget is almost exceeded." />
      <Alert
        severity="error"
        message="Failed to load data. Please try again."
      />
      <Alert severity="info" message="New features are available." />
    </div>
  ),
}
