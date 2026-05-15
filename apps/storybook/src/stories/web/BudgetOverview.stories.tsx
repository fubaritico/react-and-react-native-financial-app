import { BudgetOverview } from '@financial-app/features'
import i18n from 'i18next'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const noop = () => undefined

/** Budget data matching the design reference screenshots (Overview). */
const overviewBudgets = [
  { category: 'Entertainment', maximum: 50, spent: 15, color: 'green' },
  { category: 'Bills', maximum: 750, spent: 150, color: 'cyan' },
  { category: 'Dining Out', maximum: 75, spent: 133, color: 'yellow' },
  { category: 'Personal Care', maximum: 100, spent: 40, color: 'navy' },
]

/** Budget data for the Budget page (different spent values). */
const budgetPageBudgets = [
  { category: 'Bills', maximum: 750, spent: 250, color: 'cyan' },
  { category: 'Dining Out', maximum: 75, spent: 67, color: 'yellow' },
  { category: 'Personal Care', maximum: 100, spent: 65, color: 'navy' },
  { category: 'Entertainment', maximum: 50, spent: 25, color: 'green' },
]

const meta = {
  title: 'Web/Features/Overview/BudgetOverview',
  component: BudgetOverview,
} satisfies Meta<typeof BudgetOverview>

export default meta
type Story = StoryObj<typeof meta>

/** Desktop Overview — horizontal (container > 768px triggers md: breakpoint). */
export const BudgetOverviewHome: Story = {
  args: {
    title: i18n.t('budgets.title'),
    seeDetailsLabel: i18n.t('common.seeDetails'),
    onSeeDetails: noop,
    budgets: overviewBudgets,
    ofLabel: i18n.t('budgets.of'),
    limitLabel: i18n.t('budgets.limit'),
  },
  render: (args) => <BudgetOverview {...args} />,
}

/** Desktop Budget page — horizontal, spent amounts with Spending Summary. */
export const BudgetOverviewBudgetPage: Story = {
  args: {
    budgets: budgetPageBudgets,
    showSpentAmount: true,
    spendingSummaryTitle: 'Spending Summary',
    ofLabel: 'of',
    limitLabel: 'limit',
  },
  render: (args) => <BudgetOverview {...args} />,
}
