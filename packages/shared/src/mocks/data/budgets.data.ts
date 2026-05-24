import raw from './data.json'

import type { IBudget } from '../../types'

export const mockBudgets = raw.budgets as unknown as IBudget[]
