import { LinkText } from '@financial-app/ui/native'
import { View } from 'react-native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const meta = {
  title: 'Native/Design System/LinkText',
  component: LinkText,
  argTypes: {
    text: { control: 'text' },
    linkLabel: { control: 'text' },
    onLinkPress: { action: 'linkPressed' },
  },
  args: {
    text: 'Need to create an account?',
    linkLabel: 'Sign Up',
    onLinkPress: noop,
  },
} satisfies Meta<typeof LinkText>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground. */
export const Playground: Story = {}

/** Both auth link variants. */
export const Showcase: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <LinkText
        text="Need to create an account?"
        linkLabel="Sign Up"
        onLinkPress={noop}
      />
      <LinkText
        text="Already have an account?"
        linkLabel="Login"
        onLinkPress={noop}
      />
    </View>
  ),
}
