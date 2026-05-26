import { CategoriesScreenView } from '@financial-app/features'

import type { ICategoriesScreenViewProps } from '@financial-app/features'
import type { ICategory } from '@financial-app/shared'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

/** Token: color.beige-100 (#f8f4f0) — app background simulation */
const SCREEN_BG = '#f8f4f0'

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
  title: 'Web/Screens/CategoriesScreenView',
  component: CategoriesScreenView,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta
type Story = StoryObj

/** Desktop — categories grid with system + custom categories. */
export const Default: Story = {
  render: () => (
    <div style={{ minHeight: '100vh', backgroundColor: SCREEN_BG }}>
      <CategoriesScreenView {...defaultProps} />
    </div>
  ),
}

/** Desktop — system categories only (no delete overlays). */
export const SystemOnly: Story = {
  render: () => (
    <div style={{ minHeight: '100vh', backgroundColor: SCREEN_BG }}>
      <CategoriesScreenView {...defaultProps} categories={SYSTEM_CATEGORIES} />
    </div>
  ),
}

/** Desktop — empty state with no categories. */
export const Empty: Story = {
  render: () => (
    <div style={{ minHeight: '100vh', backgroundColor: SCREEN_BG }}>
      <CategoriesScreenView {...defaultProps} categories={[]} />
    </div>
  ),
}

/** Desktop — while a category is being deleted. */
export const Deleting: Story = {
  render: () => (
    <div style={{ minHeight: '100vh', backgroundColor: SCREEN_BG }}>
      <CategoriesScreenView {...defaultProps} deletingId="11" />
    </div>
  ),
}

/** Desktop — while adding a new category. */
export const Adding: Story = {
  render: () => (
    <div style={{ minHeight: '100vh', backgroundColor: SCREEN_BG }}>
      <CategoriesScreenView {...defaultProps} isAdding />
    </div>
  ),
}
