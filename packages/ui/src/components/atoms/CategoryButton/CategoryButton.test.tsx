import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { CategoryButton } from './CategoryButton.web'

afterEach(cleanup)

describe('CategoryButton', () => {
  const baseProps = {
    icon: 'categoryGeneral' as const,
    color: 'green',
    name: 'General',
    accessibilityLabel: 'General',
  }

  describe('happy path', () => {
    it('renders with name and accessible label (non-deletable)', () => {
      render(<CategoryButton {...baseProps} />)
      expect(screen.getByRole('img', { name: 'General' })).toBeTruthy()
      expect(screen.getByText('General')).toBeTruthy()
    })

    it('renders as a button when isDeletable', () => {
      render(
        <CategoryButton {...baseProps} id="1" isDeletable onDelete={vi.fn()} />
      )
      expect(screen.getByRole('button', { name: 'General' })).toBeTruthy()
    })

    it('fires onDelete with id when clicked in deletable mode', async () => {
      const user = userEvent.setup()
      const onDelete = vi.fn()
      render(
        <CategoryButton
          {...baseProps}
          id="cat-1"
          isDeletable
          onDelete={onDelete}
        />
      )
      await user.click(screen.getByRole('button', { name: 'General' }))
      expect(onDelete).toHaveBeenCalledWith('cat-1')
    })
  })

  describe('variants', () => {
    it('renders different icons', () => {
      const { rerender } = render(
        <CategoryButton {...baseProps} icon="categoryBills" name="Bills" />
      )
      expect(screen.getByText('Bills')).toBeTruthy()
      rerender(
        <CategoryButton {...baseProps} icon="categoryPlane" name="Travel" />
      )
      expect(screen.getByText('Travel')).toBeTruthy()
    })

    it('applies color via inline style on circle', () => {
      const { container } = render(
        <CategoryButton {...baseProps} color="cyan" />
      )
      const circle = container.querySelector<HTMLElement>(
        '[style*="background-color"]'
      )
      expect(circle?.style.backgroundColor).toBe('var(--color-cyan)')
    })
  })

  describe('managed errors', () => {
    it('is disabled when isDeleting is true', () => {
      render(
        <CategoryButton
          {...baseProps}
          id="1"
          isDeletable
          isDeleting
          onDelete={vi.fn()}
        />
      )
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('does not call onDelete when disabled', async () => {
      const user = userEvent.setup()
      const onDelete = vi.fn()
      render(
        <CategoryButton
          {...baseProps}
          id="1"
          isDeletable
          isDeleting
          onDelete={onDelete}
        />
      )
      await user.click(screen.getByRole('button'))
      expect(onDelete).not.toHaveBeenCalled()
    })
  })

  // L4: N/A — no async operations, pure presentational component

  describe('edge cases', () => {
    it('does not fire onDelete when id is missing', async () => {
      const user = userEvent.setup()
      const onDelete = vi.fn()
      render(<CategoryButton {...baseProps} isDeletable onDelete={onDelete} />)
      await user.click(screen.getByRole('button'))
      expect(onDelete).not.toHaveBeenCalled()
    })

    it('does not fire onDelete when onDelete is missing', async () => {
      const user = userEvent.setup()
      render(<CategoryButton {...baseProps} id="1" isDeletable />)
      await user.click(screen.getByRole('button'))
      // no error thrown
    })

    it('renders long name without crashing', () => {
      const longName = 'A'.repeat(100)
      render(<CategoryButton {...baseProps} name={longName} />)
      expect(screen.getByText(longName)).toBeTruthy()
    })
  })
})
