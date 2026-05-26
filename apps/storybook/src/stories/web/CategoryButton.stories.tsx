import { CategoryButton } from '@financial-app/ui'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const meta = {
  title: 'Web/Design System/Atoms/CategoryButton',
  component: CategoryButton,
  argTypes: {
    color: {
      control: 'select',
      options: [
        'green',
        'cyan',
        'navy',
        'blue',
        'purple',
        'magenta',
        'brown',
        'orange',
        'gold',
        'turquoise',
      ],
    },
    isDeletable: { control: 'boolean' },
    isDeleting: { control: 'boolean' },
  },
  args: {
    icon: 'categoryGeneral',
    color: 'green',
    name: 'General',
    accessibilityLabel: 'General',
  },
} satisfies Meta<typeof CategoryButton>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}

/** System category — non-deletable, static display. */
export const SystemCategory: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', maxWidth: 400 }}>
      <CategoryButton
        icon="categoryGeneral"
        color="green"
        name="General"
        accessibilityLabel="General"
      />
      <CategoryButton
        icon="categoryDiningOut"
        color="cyan"
        name="Dining Out"
        accessibilityLabel="Dining Out"
      />
      <CategoryButton
        icon="categoryBills"
        color="orange"
        name="Bills"
        accessibilityLabel="Bills"
      />
      <CategoryButton
        icon="categoryEntertainment"
        color="blue"
        name="Entertainment"
        accessibilityLabel="Entertainment"
      />
    </div>
  ),
}

/** Custom category — deletable, hover reveals cross badge. */
export const CustomDeletable: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', maxWidth: 400 }}>
      <CategoryButton
        id="1"
        icon="categoryCafe"
        color="brown"
        name="Coffee"
        accessibilityLabel="Coffee"
        isDeletable
        onDelete={noop}
      />
      <CategoryButton
        id="2"
        icon="categoryPlane"
        color="blue"
        name="Travel"
        accessibilityLabel="Travel"
        isDeletable
        onDelete={noop}
      />
    </div>
  ),
}

/** Deleting state — badge always visible, button disabled. */
export const DeletingState: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <CategoryButton
        id="1"
        icon="categoryCafe"
        color="brown"
        name="Coffee"
        accessibilityLabel="Coffee"
        isDeletable
        isDeleting
        onDelete={noop}
      />
    </div>
  ),
}

/** Long name — tests text truncation. */
export const LongName: Story = {
  render: () => (
    <div style={{ width: 100 }}>
      <CategoryButton
        icon="categoryGeneral"
        color="purple"
        name="Very Long Category Name"
        accessibilityLabel="Very Long Category Name"
      />
    </div>
  ),
}
