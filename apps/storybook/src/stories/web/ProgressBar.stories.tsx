import { Card, ProgressBar, Typography } from '@financial-app/ui'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Web/Design System/Atoms/ProgressBar',
  component: ProgressBar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['thick', 'thin'] },
    color: {
      control: 'select',
      options: [
        'green',
        'cyan',
        'yellow',
        'navy',
        'red',
        'purple',
        'turquoise',
      ],
    },
    value: { control: { type: 'range', min: 0, max: 1000, step: 10 } },
    max: { control: { type: 'range', min: 0, max: 1000, step: 10 } },
    buffer: { control: { type: 'range', min: 0, max: 1000, step: 10 } },
    bufferColor: { control: 'select', options: ['success', 'destructive'] },
  },
  args: {
    value: 15,
    max: 50,
    color: 'green',
    size: 'thick',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}

/** Thick bar with budget-style meta (spent / remaining with colored borders). */
export const BudgetStyle: Story = {
  args: {
    value: 15,
    max: 50,
    color: 'green',
    size: 'thick',
    metaLeft: (
      <div
        style={{
          borderLeft: '4px solid var(--color-base-green-DEFAULT)',
          paddingLeft: 16,
        }}
      >
        <Typography variant="caption" color="muted">
          Spent
        </Typography>
        <Typography variant="body-bold">$15.00</Typography>
      </div>
    ),
    metaRight: (
      <div
        style={{
          borderLeft: '4px solid var(--color-base-beige-100)',
          paddingLeft: 16,
        }}
      >
        <Typography variant="caption" color="muted">
          Remaining
        </Typography>
        <Typography variant="body-bold">$35.00</Typography>
      </div>
    ),
  },
  render: (args) => (
    <Card>
      <Typography variant="caption" color="muted">
        Maximum of $50.00
      </Typography>
      <div style={{ marginTop: 16 }}>
        <ProgressBar {...args} />
      </div>
    </Card>
  ),
}

/** Thin bar with pot-style meta (percentage / target). */
export const PotStyle: Story = {
  args: {
    value: 159,
    max: 2000,
    color: 'green',
    size: 'thin',
    metaLeft: (
      <Typography variant="caption" color="muted">
        7.95%
      </Typography>
    ),
    metaRight: (
      <Typography variant="caption" color="muted">
        Target of $2,000
      </Typography>
    ),
  },
  render: (args) => (
    <Card>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="caption" color="muted">
          Total Saved
        </Typography>
        <Typography variant="heading-lg">$159.00</Typography>
      </div>
      <div style={{ marginTop: 16 }}>
        <ProgressBar {...args} />
      </div>
    </Card>
  ),
}

/** Bar at 100% (fully filled). */
export const Full: Story = {
  args: {
    value: 50,
    max: 50,
    color: 'cyan',
    size: 'thick',
  },
}

/** Bar at 0% (empty). */
export const Empty: Story = {
  args: {
    value: 0,
    max: 750,
    color: 'navy',
    size: 'thick',
  },
}

/** Overspent — value exceeds max (clamped to 100%). */
export const Overspent: Story = {
  args: {
    value: 133,
    max: 75,
    color: 'yellow',
    size: 'thick',
  },
}

/** Add money to pot — buffer in success color, simulating $400 added to $159 saved (target $2000). */
export const AddMoneyBuffer: Story = {
  args: {
    value: 159,
    max: 2000,
    color: 'grey-900',
    size: 'thin',
    buffer: 400,
    bufferColor: 'success',
    metaLeft: (
      <Typography variant="caption" color="success">
        27.95%
      </Typography>
    ),
    metaRight: (
      <Typography variant="caption" color="muted">
        Target of $2,000
      </Typography>
    ),
  },
  render: (args) => (
    <Card>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="caption" color="muted">
          New Amount
        </Typography>
        <Typography variant="heading-lg">$559.00</Typography>
      </div>
      <div style={{ marginTop: 16 }}>
        <ProgressBar {...args} />
      </div>
    </Card>
  ),
}

/** Withdraw from pot — buffer in destructive color, simulating $20 withdrawn from $159 saved (target $2000). */
export const WithdrawBuffer: Story = {
  args: {
    value: 139,
    max: 2000,
    color: 'grey-900',
    size: 'thin',
    buffer: 20,
    bufferColor: 'destructive',
    metaLeft: (
      <Typography variant="caption" color="destructive">
        5.95%
      </Typography>
    ),
    metaRight: (
      <Typography variant="caption" color="muted">
        Target of $2,000
      </Typography>
    ),
  },
  render: (args) => (
    <Card>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="caption" color="muted">
          New Amount
        </Typography>
        <Typography variant="heading-lg">$139.00</Typography>
      </div>
      <div style={{ marginTop: 16 }}>
        <ProgressBar {...args} />
      </div>
    </Card>
  ),
}

/** All colors and sizes side by side. */
export const Showcase: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const colors = [
      'green',
      'cyan',
      'yellow',
      'navy',
      'red',
      'purple',
      'turquoise',
    ]
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <section>
          <Typography variant="subsection-title">Thick (Budget)</Typography>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              marginTop: 12,
            }}
          >
            {colors.map((c) => (
              <div key={c}>
                <Typography variant="caption" color="muted">
                  {c}
                </Typography>
                <ProgressBar value={60} max={100} color={c} size="thick" />
              </div>
            ))}
          </div>
        </section>

        <section>
          <Typography variant="subsection-title">Thin (Pots)</Typography>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              marginTop: 12,
            }}
          >
            {colors.map((c) => (
              <div key={c}>
                <Typography variant="caption" color="muted">
                  {c}
                </Typography>
                <ProgressBar value={40} max={100} color={c} size="thin" />
              </div>
            ))}
          </div>
        </section>
      </div>
    )
  },
}
