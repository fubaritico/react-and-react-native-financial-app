import { Dropdown } from '@financial-app/ui/native'
import { useState } from 'react'
import { View } from 'react-native'

import type { IDropdownOption } from '@financial-app/ui/native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const sortOptions: IDropdownOption[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'a-to-z', label: 'A to Z' },
  { value: 'z-to-a', label: 'Z to A' },
  { value: 'highest', label: 'Highest' },
  { value: 'lowest', label: 'Lowest' },
]

const categoryOptions: IDropdownOption[] = [
  { value: 'all', label: 'All Transactions' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'bills', label: 'Bills' },
  { value: 'groceries', label: 'Groceries' },
  { value: 'dining-out', label: 'Dining Out' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'personal-care', label: 'Personal Care' },
]

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const meta = {
  title: 'Native/Design System/Molecules/Dropdown',
  component: Dropdown,
  parameters: { layout: 'centered' },
  argTypes: {
    label: { control: 'text' },
    bottomSheetTitle: { control: 'text' },
    selectedValue: {
      control: 'select',
      options: sortOptions.map((o) => o.value),
    },
    onSelect: { table: { disable: true } },
  },
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>

const PlaygroundComponent = (args: {
  label?: string
  bottomSheetTitle?: string
  selectedValue: string
}) => {
  const [selected, setSelected] = useState(args.selectedValue)
  return (
    <View style={{ alignItems: 'flex-start' }}>
      <Dropdown
        label={args.label}
        bottomSheetTitle={args.bottomSheetTitle}
        options={sortOptions}
        selectedValue={selected}
        onSelect={setSelected}
        accessibilityLabel="Sort transactions"
        menuAccessibilityLabel="Sort options"
      />
    </View>
  )
}

/** Interactive playground — opens dark bottom sheet on tap. */
export const Playground: Story = {
  args: {
    label: 'Sort by',
    bottomSheetTitle: 'Sort by',
    selectedValue: 'latest',
    options: sortOptions,
    onSelect: noop,
  },
  render: (args) => (
    <PlaygroundComponent
      label={args.label}
      bottomSheetTitle={args.bottomSheetTitle}
      selectedValue={args.selectedValue}
    />
  ),
}

const ShowcaseComponent = () => {
  const [sortValue, setSortValue] = useState('latest')
  const [categoryValue, setCategoryValue] = useState('all')

  return (
    <View style={{ gap: 24 }}>
      <Dropdown
        label="Sort by"
        bottomSheetTitle="Sort by"
        options={sortOptions}
        selectedValue={sortValue}
        onSelect={setSortValue}
        accessibilityLabel="Sort transactions"
        menuAccessibilityLabel="Sort options"
      />
      <Dropdown
        label="Category"
        bottomSheetTitle="Category"
        options={categoryOptions}
        selectedValue={categoryValue}
        onSelect={setCategoryValue}
        accessibilityLabel="Filter by category"
        menuAccessibilityLabel="Category options"
      />
    </View>
  )
}

/** Sort + Category dropdowns side by side. */
export const Showcase: Story = {
  args: { options: sortOptions, selectedValue: 'latest', onSelect: noop },
  render: () => <ShowcaseComponent />,
  parameters: { controls: { disable: true } },
}
