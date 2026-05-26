import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { IconButton } from './IconButton.web'

afterEach(cleanup)

describe('IconButton', () => {
  const baseProps = {
    icon: 'arrowLeft' as const,
    onPress: vi.fn(),
    accessibilityLabel: 'Go back',
  }

  describe('happy path', () => {
    it('renders with accessible label', () => {
      render(<IconButton {...baseProps} />)
      expect(screen.getByRole('button', { name: 'Go back' })).toBeTruthy()
    })

    it('fires onPress when clicked', async () => {
      const user = userEvent.setup()
      const onPress = vi.fn()
      render(<IconButton {...baseProps} onPress={onPress} />)
      await user.click(screen.getByRole('button', { name: 'Go back' }))
      expect(onPress).toHaveBeenCalledOnce()
    })
  })

  describe('variants', () => {
    it('renders with primary variant', () => {
      render(<IconButton {...baseProps} variant="primary" />)
      expect(screen.getByRole('button')).toBeTruthy()
    })

    it('renders with secondary variant', () => {
      render(<IconButton {...baseProps} variant="secondary" />)
      expect(screen.getByRole('button')).toBeTruthy()
    })

    it('renders with ghost variant (default)', () => {
      render(<IconButton {...baseProps} />)
      expect(screen.getByRole('button')).toBeTruthy()
    })

    it('renders with destroy variant', () => {
      render(<IconButton {...baseProps} variant="destroy" />)
      expect(screen.getByRole('button')).toBeTruthy()
    })

    it('renders with sm size', () => {
      render(<IconButton {...baseProps} size="sm" />)
      expect(screen.getByRole('button')).toBeTruthy()
    })

    it('renders with lg size', () => {
      render(<IconButton {...baseProps} size="lg" />)
      expect(screen.getByRole('button')).toBeTruthy()
    })
  })

  describe('managed errors', () => {
    it('is disabled when disabled prop is true', () => {
      render(<IconButton {...baseProps} disabled />)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('does not fire onPress when disabled', async () => {
      const user = userEvent.setup()
      const onPress = vi.fn()
      render(<IconButton {...baseProps} onPress={onPress} disabled />)
      await user.click(screen.getByRole('button'))
      expect(onPress).not.toHaveBeenCalled()
    })
  })

  // L4: N/A — no async operations, pure presentational component

  describe('edge cases', () => {
    it('applies additional className', () => {
      const { container } = render(
        <IconButton {...baseProps} className="mt-4" />
      )
      const button = container.querySelector('button')
      expect(button?.className).toContain('mt-4')
    })

    it('renders with shadow prop without crashing', () => {
      render(<IconButton {...baseProps} shadow />)
      expect(screen.getByRole('button')).toBeTruthy()
    })
  })
})
