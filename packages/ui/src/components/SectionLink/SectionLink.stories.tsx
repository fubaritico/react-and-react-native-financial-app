import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

import { SectionLink } from './SectionLink.web'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const meta = {
  title: 'Components/SectionLink',
  component: SectionLink,
  argTypes: {
    label: { control: 'text' },
    onPress: { action: 'pressed' },
  },
  args: {
    label: 'See Details',
    onPress: noop,
  },
} satisfies Meta<typeof SectionLink>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}

/** Both label variants used in the app. */
export const Showcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionLink label="See Details" onPress={noop} />
      <SectionLink label="View All" onPress={noop} />
    </div>
  ),
}
