import raw from './data.json'

import type { ITransaction } from '../../types'

export const mockTransactions = raw.transactions as unknown as ITransaction[]
