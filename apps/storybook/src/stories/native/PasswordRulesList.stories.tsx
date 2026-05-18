import { PasswordRulesList } from '@financial-app/ui/native'

import type { IPasswordRule } from '@financial-app/ui/native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const PRISTINE_RULES: IPasswordRule[] = [
  { label: 'At least 16 characters', state: 'pristine' },
  { label: 'At least one uppercase letter', state: 'pristine' },
  { label: 'At least one lowercase letter', state: 'pristine' },
  { label: 'At least one digit', state: 'pristine' },
  { label: 'At least one special character ($@&+?!/-)', state: 'pristine' },
  { label: 'Passwords must match', state: 'pristine' },
]

const ALL_VALID_RULES: IPasswordRule[] = PRISTINE_RULES.map((r) => ({
  ...r,
  state: 'valid',
}))

const MIXED_RULES: IPasswordRule[] = [
  { label: 'At least 16 characters', state: 'valid' },
  { label: 'At least one uppercase letter', state: 'valid' },
  { label: 'At least one lowercase letter', state: 'valid' },
  { label: 'At least one digit', state: 'invalid' },
  { label: 'At least one special character ($@&+?!/-)', state: 'invalid' },
  { label: 'Passwords must match', state: 'pristine' },
]

const meta = {
  title: 'Native/Design System/Molecules/PasswordRulesList',
  component: PasswordRulesList,
  tags: ['autodocs'],
  args: {
    rules: PRISTINE_RULES,
  },
} satisfies Meta<typeof PasswordRulesList>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}

/** All visual states. */
export const AllValid: Story = {
  args: { rules: ALL_VALID_RULES },
}

/** Mixed valid, invalid and pristine states. */
export const Mixed: Story = {
  args: { rules: MIXED_RULES },
}
