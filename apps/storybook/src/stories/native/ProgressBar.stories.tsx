import { tokens } from '@financial-app/tokens/map'
import { Card, ProgressBar, Typography } from '@financial-app/ui'
import { View } from 'react-native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Native/Design System/Atoms/ProgressBar',
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
      <View style={{ width: 400 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}

/** Thick bar with budget-style meta. */
export const BudgetStyle: Story = {
  argTypes: {
    buffer: {
      table: {
        disable: true,
      },
    },
    bufferColor: {
      table: {
        disable: true,
      },
    },
    metaLeft: {
      table: {
        disable: true,
      },
    },
    metaRight: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    value: 15,
    max: 50,
    color: 'green',
    size: 'thick',
    metaLeft: (
      <View
        style={{
          borderLeftWidth: 4,
          borderLeftColor: tokens.color.base.green.DEFAULT,
          paddingLeft: 16,
        }}
      >
        <Typography variant="caption" color="muted">
          Spent
        </Typography>
        <Typography variant="body-bold">$15.00</Typography>
      </View>
    ),
    metaRight: (
      <View
        style={{
          borderLeftWidth: 4,
          borderLeftColor: tokens.color.base.beige[100],
          paddingLeft: 16,
        }}
      >
        <Typography variant="caption" color="muted">
          Remaining
        </Typography>
        <Typography variant="body-bold">$35.00</Typography>
      </View>
    ),
  },
  render: (args) => (
    <Card>
      <Typography variant="caption" color="muted">
        Maximum of $50.00
      </Typography>
      <View style={{ marginTop: 16 }}>
        <ProgressBar {...args} />
      </View>
    </Card>
  ),
}

/** Thin bar with pot-style meta. */
export const PotStyle: Story = {
  argTypes: {
    buffer: {
      table: {
        disable: true,
      },
    },
    bufferColor: {
      table: {
        disable: true,
      },
    },
    metaLeft: {
      table: {
        disable: true,
      },
    },
    metaRight: {
      table: {
        disable: true,
      },
    },
  },
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="caption" color="muted">
          Total Saved
        </Typography>
        <Typography variant="heading-lg">$159.00</Typography>
      </View>
      <View style={{ marginTop: 16 }}>
        <ProgressBar {...args} />
      </View>
    </Card>
  ),
}

/** Bar at 100% (fully filled). */
export const Full: Story = {
  argTypes: {
    buffer: {
      table: {
        disable: true,
      },
    },
    bufferColor: {
      table: {
        disable: true,
      },
    },
    metaLeft: {
      table: {
        disable: true,
      },
    },
    metaRight: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    value: 50,
    max: 50,
    color: 'cyan',
    size: 'thick',
  },
}

/** Overspent — value exceeds max (clamped to 100%). */
export const Overspent: Story = {
  argTypes: {
    buffer: {
      table: {
        disable: true,
      },
    },
    bufferColor: {
      table: {
        disable: true,
      },
    },
    metaLeft: {
      table: {
        disable: true,
      },
    },
    metaRight: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    value: 133,
    max: 75,
    color: 'yellow',
    size: 'thick',
  },
}

/** Add money to pot — buffer in success color, simulating $400 added to $159 saved (target $2000). */
export const AddMoneyBuffer: Story = {
  argTypes: {
    color: {
      table: {
        disable: true,
      },
    },
    bufferColor: {
      table: {
        disable: true,
      },
    },
    metaLeft: {
      table: {
        disable: true,
      },
    },
    metaRight: {
      table: {
        disable: true,
      },
    },
  },
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="caption" color="muted">
          New Amount
        </Typography>
        <Typography variant="heading-lg">$559.00</Typography>
      </View>
      <View style={{ marginTop: 16 }}>
        <ProgressBar {...args} />
      </View>
    </Card>
  ),
}

/** Withdraw from pot — buffer in destructive color, simulating $20 withdrawn from $159 saved (target $2000). */
export const WithdrawBuffer: Story = {
  argTypes: {
    color: {
      table: {
        disable: true,
      },
    },
    bufferColor: {
      table: {
        disable: true,
      },
    },
    metaLeft: {
      table: {
        disable: true,
      },
    },
    metaRight: {
      table: {
        disable: true,
      },
    },
  },
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="caption" color="muted">
          New Amount
        </Typography>
        <Typography variant="heading-lg">$139.00</Typography>
      </View>
      <View style={{ marginTop: 16 }}>
        <ProgressBar {...args} />
      </View>
    </Card>
  ),
}
