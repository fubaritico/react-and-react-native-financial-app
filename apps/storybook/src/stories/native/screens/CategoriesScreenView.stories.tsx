import { CategoriesScreenView } from '@financial-app/features/native'
import { View } from 'react-native'

import type { ICategoriesScreenViewProps } from '@financial-app/features'
import type { ICategory } from '@financial-app/shared'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import type { ReactNode } from 'react'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

/** Token: color.black (#000000) — device bezel simulation */
const DEVICE_FRAME_BG = '#000000'
/** Token: color.beige-100 (#f8f4f0) — app background simulation */
const DEVICE_SCREEN_BG = '#f8f4f0'

/** iPhone 16 Pro screen dimensions */
const IPHONE_WIDTH = 393
const IPHONE_HEIGHT = 852

/** Pixel 9 screen dimensions */
const ANDROID_WIDTH = 412
const ANDROID_HEIGHT = 915

/**
 * Device frame wrapper — dark background with a beige rounded screen.
 * @param props - Frame dimensions and children
 * @returns A simulated device frame
 */
const DeviceFrame = ({
  width,
  height,
  children,
}: {
  /** Frame width in pixels */
  width: number
  /** Frame height in pixels */
  height: number
  /** Screen content */
  children: ReactNode
}) => (
  <View
    style={{
      backgroundColor: DEVICE_FRAME_BG,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <View
      style={{
        width,
        height,
        backgroundColor: DEVICE_SCREEN_BG,
        borderRadius: 20,
        overflow: 'hidden',
      }}
    >
      {children}
    </View>
  </View>
)

/** Mock system categories. */
const SYSTEM_CATEGORIES: ICategory[] = [
  {
    id: '1',
    name: 'General',
    icon: 'categoryGeneral',
    color: 'green',
    is_system: true,
  },
  {
    id: '2',
    name: 'Dining Out',
    icon: 'categoryDiningOut',
    color: 'cyan',
    is_system: true,
  },
  {
    id: '3',
    name: 'Groceries',
    icon: 'categoryGroceries',
    color: 'navy',
    is_system: true,
  },
  {
    id: '4',
    name: 'Entertainment',
    icon: 'categoryEntertainment',
    color: 'blue',
    is_system: true,
  },
  {
    id: '5',
    name: 'Transportation',
    icon: 'categoryTransportation',
    color: 'purple',
    is_system: true,
  },
  {
    id: '6',
    name: 'Lifestyle',
    icon: 'categoryLifeStyle',
    color: 'magenta',
    is_system: true,
  },
  {
    id: '7',
    name: 'Personal Care',
    icon: 'categoryPersonalCare',
    color: 'turquoise',
    is_system: true,
  },
  {
    id: '8',
    name: 'Education',
    icon: 'categoryEducation',
    color: 'brown',
    is_system: true,
  },
  {
    id: '9',
    name: 'Bills',
    icon: 'categoryBills',
    color: 'orange',
    is_system: true,
  },
  {
    id: '10',
    name: 'Shopping',
    icon: 'categoryShopping',
    color: 'gold',
    is_system: true,
  },
]

/** Mock custom categories (deletable). */
const CUSTOM_CATEGORIES: ICategory[] = [
  {
    id: '11',
    name: 'Coffee',
    icon: 'categoryCafe',
    color: 'brown',
    is_system: false,
  },
  {
    id: '12',
    name: 'Travel',
    icon: 'categoryPlane',
    color: 'blue',
    is_system: false,
  },
]

const allCategories = [...SYSTEM_CATEGORIES, ...CUSTOM_CATEGORIES]

const defaultProps: ICategoriesScreenViewProps = {
  categories: allCategories,
  onAddCategory: noop,
  onDeleteCategory: noop,
  isAdding: false,
  deletingId: null,
  onGoBack: noop,
}

const meta = {
  title: 'Native/Screens/CategoriesScreenView',
  component: CategoriesScreenView,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta
type Story = StoryObj

/** iPhone 16 Pro — categories grid with system + custom categories. */
export const IPhoneDefault: Story = {
  parameters: { backgrounds: 'dark' },
  render: () => (
    <DeviceFrame width={IPHONE_WIDTH} height={IPHONE_HEIGHT}>
      <CategoriesScreenView {...defaultProps} />
    </DeviceFrame>
  ),
}

/** iPhone 16 Pro — system categories only. */
export const IPhoneSystemOnly: Story = {
  parameters: { backgrounds: 'dark' },
  render: () => (
    <DeviceFrame width={IPHONE_WIDTH} height={IPHONE_HEIGHT}>
      <CategoriesScreenView {...defaultProps} categories={SYSTEM_CATEGORIES} />
    </DeviceFrame>
  ),
}

/** iPhone 16 Pro — empty state. */
export const IPhoneEmpty: Story = {
  parameters: { backgrounds: 'dark' },
  render: () => (
    <DeviceFrame width={IPHONE_WIDTH} height={IPHONE_HEIGHT}>
      <CategoriesScreenView {...defaultProps} categories={[]} />
    </DeviceFrame>
  ),
}

/** Pixel 9 — categories grid with system + custom categories. */
export const Android: Story = {
  parameters: { backgrounds: 'dark' },
  render: () => (
    <DeviceFrame width={ANDROID_WIDTH} height={ANDROID_HEIGHT}>
      <CategoriesScreenView {...defaultProps} />
    </DeviceFrame>
  ),
}
