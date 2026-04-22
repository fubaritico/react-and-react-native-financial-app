import { LinkText } from '@financial-app/ui'
import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const meta = {
  title: 'Web/Design System/LinkText',
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
    </div>
  ),
}
