import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { ICategory } from '@financial-app/shared'

import { CategoriesScreenView } from './CategoriesScreenView.web'

import type { ICategoriesScreenViewProps } from './CategoriesScreenView'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

afterEach(cleanup)

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
]

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

const ALL_CATEGORIES = [...SYSTEM_CATEGORIES, ...CUSTOM_CATEGORIES]

const defaultProps: ICategoriesScreenViewProps = {
  categories: ALL_CATEGORIES,
  onAddCategory: vi.fn(),
  onDeleteCategory: vi.fn(),
  isAdding: false,
  deletingId: null,
  onGoBack: vi.fn(),
}

describe('CategoriesScreenView', () => {
  describe('happy path', () => {
    it('renders the title', () => {
      render(<CategoriesScreenView {...defaultProps} />)
      expect(screen.getByText('categories.title')).toBeTruthy()
    })

    it('renders all categories by name', () => {
      render(<CategoriesScreenView {...defaultProps} />)
      expect(screen.getByText('General')).toBeTruthy()
      expect(screen.getByText('Dining Out')).toBeTruthy()
      expect(screen.getByText('Coffee')).toBeTruthy()
      expect(screen.getByText('Travel')).toBeTruthy()
    })

    it('renders the add category form section', () => {
      render(<CategoriesScreenView {...defaultProps} />)
      expect(screen.getByText('categories.addCategory')).toBeTruthy()
      expect(
        screen.getByPlaceholderText('categories.namePlaceholder')
      ).toBeTruthy()
    })

    it('calls onGoBack when back button is pressed', async () => {
      const user = userEvent.setup()
      const onGoBack = vi.fn()
      render(<CategoriesScreenView {...defaultProps} onGoBack={onGoBack} />)
      await user.click(screen.getByRole('button', { name: 'common.back' }))
      expect(onGoBack).toHaveBeenCalledOnce()
    })
  })

  describe('variants', () => {
    it('renders with system-only categories (no delete buttons on system)', () => {
      render(
        <CategoriesScreenView
          {...defaultProps}
          categories={SYSTEM_CATEGORIES}
        />
      )
      expect(screen.getByText('General')).toBeTruthy()
      // System categories render as role="img" not buttons
      expect(screen.getAllByRole('img')).toHaveLength(2)
    })

    it('renders custom categories as deletable buttons', () => {
      render(
        <CategoriesScreenView
          {...defaultProps}
          categories={CUSTOM_CATEGORIES}
        />
      )
      expect(screen.getByRole('button', { name: 'Coffee' })).toBeTruthy()
      expect(screen.getByRole('button', { name: 'Travel' })).toBeTruthy()
    })

    it('shows adding state with busy submit button', () => {
      render(<CategoriesScreenView {...defaultProps} isAdding />)
      const busyButtons = screen
        .getAllByRole('button')
        .filter((btn) => btn.getAttribute('aria-busy') === 'true')
      expect(busyButtons).toHaveLength(1)
    })
  })

  describe('managed errors', () => {
    it('disables submit button when name is empty', () => {
      render(<CategoriesScreenView {...defaultProps} />)
      const submitBtn = screen.getByRole('button', { name: 'categories.add' })
      expect(submitBtn).toBeDisabled()
    })

    it('does not call onAddCategory when form is incomplete', async () => {
      const user = userEvent.setup()
      const onAddCategory = vi.fn()
      render(
        <CategoriesScreenView {...defaultProps} onAddCategory={onAddCategory} />
      )
      // Type name but no icon/color selected
      await user.type(
        screen.getByPlaceholderText('categories.namePlaceholder'),
        'Test'
      )
      // Submit button should still be disabled
      const submitBtn = screen.getByRole('button', { name: 'categories.add' })
      expect(submitBtn).toBeDisabled()
      expect(onAddCategory).not.toHaveBeenCalled()
    })
  })

  // L4: N/A — pure presentational view, no async operations

  describe('edge cases', () => {
    it('renders with empty categories array', () => {
      render(<CategoriesScreenView {...defaultProps} categories={[]} />)
      expect(screen.getByText('categories.title')).toBeTruthy()
      // No category names rendered
      expect(screen.queryByText('General')).toBeNull()
    })

    it('marks specific category as deleting', () => {
      render(<CategoriesScreenView {...defaultProps} deletingId="11" />)
      // The deleting category button should be disabled
      const coffeeBtn = screen.getByRole('button', { name: 'Coffee' })
      expect(coffeeBtn).toBeDisabled()
    })

    it('calls onDeleteCategory with correct id when custom category is clicked', async () => {
      const user = userEvent.setup()
      const onDeleteCategory = vi.fn()
      render(
        <CategoriesScreenView
          {...defaultProps}
          onDeleteCategory={onDeleteCategory}
        />
      )
      await user.click(screen.getByRole('button', { name: 'Coffee' }))
      expect(onDeleteCategory).toHaveBeenCalledWith('11')
    })
  })
})
