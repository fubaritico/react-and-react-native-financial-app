import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

interface MutationEntry {
  mutate: ReturnType<typeof vi.fn>
  opts: Record<string, unknown>
}
let mutations: MutationEntry[]

const mockInvalidateQueries = vi.fn()

vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn((opts: Record<string, unknown>) => {
    const entry: MutationEntry = { mutate: vi.fn(), opts }
    mutations.push(entry)
    return { mutate: entry.mutate }
  }),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: mockInvalidateQueries,
  })),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

vi.mock('@financial-app/http-client', () => ({
  deleteTransactionsByIdMutation: vi.fn(() => ({})),
  getRecurringBillsQueryKey: vi.fn(() => ['recurring']),
  getTransactionsOptions: vi.fn(() => ({ queryKey: ['transactions'] })),
  postTransactionsMutation: vi.fn(() => ({})),
  putTransactionsByIdMutation: vi.fn(() => ({})),
}))

vi.mock('@financial-app/shared', () => ({
  toTimestamptz: vi.fn((d: string) => `${d}T00:00:00Z`),
}))

vi.mock('../createTransactionModalConfigs', () => ({
  createAddTransactionModalConfig: vi.fn((...args: unknown[]) => ({
    title: 'Add',
    actions: [
      {
        label: 'Add',
        variant: 'primary' as const,
        onPress: args[1] as () => void,
      },
    ],
  })),
  createEditTransactionModalConfig: vi.fn((...args: unknown[]) => ({
    title: 'Edit',
    actions: [
      {
        label: 'Save',
        variant: 'primary' as const,
        onPress: args[1] as () => void,
      },
    ],
  })),
  createDeleteTransactionModalConfig: vi.fn((...args: unknown[]) => ({
    title: 'Delete',
    actions: [
      {
        label: 'Del',
        variant: 'destroy' as const,
        onPress: args[2] as () => void,
      },
    ],
  })),
}))

import { useTransactionCrud } from './useTransactionCrud'

const VALID_FORM_DATA = {
  name: 'Netflix',
  amount: '-15.99',
  category_id: 'cat-001',
  date: '2026-05-21',
  recurring: true,
}

const TRANSACTION_FIXTURE = {
  id: 'txn-1',
  name: 'Netflix',
  category_id: 'cat-001',
  category_name: 'Entertainment',
  category_icon: 'categoryEntertainment',
  category_color: 'green',
  date: '2026-05-21',
  amount: -15.99,
  recurring: true,
}

function createMockParams() {
  return {
    modal: { open: vi.fn(), close: vi.fn(), setSubmitting: vi.fn() },
    formBridge: {
      getFormData: vi.fn(() => ({ ...VALID_FORM_DATA })),
      hasErrors: vi.fn(() => false),
      triggerValidation: vi.fn(),
    },
    showSuccess: vi.fn(),
    showError: vi.fn(),
    renderForm: vi.fn(() => null),
    renderDeleteBody: vi.fn(() => null),
  }
}

describe('useTransactionCrud', () => {
  beforeEach(() => {
    mutations = []
    vi.clearAllMocks()
  })

  it('handleAdd opens modal with add config', () => {
    const params = createMockParams()
    const { result } = renderHook(() => useTransactionCrud(params))

    act(() => {
      result.current.handleAdd()
    })

    expect(params.modal.open).toHaveBeenCalledTimes(1)
    const config = params.modal.open.mock.calls[0][0] as { title: string }
    expect(config.title).toBe('Add')
  })

  it('submit happy path: calls setSubmitting and create mutate with parsed body', async () => {
    const params = createMockParams()
    const { result } = renderHook(() => useTransactionCrud(params))

    act(() => {
      result.current.handleAdd()
    })

    const addConfig = params.modal.open.mock.calls[0][0] as {
      actions: { onPress: () => Promise<void> }[]
    }
    await act(async () => {
      await addConfig.actions[0].onPress()
    })

    expect(params.modal.setSubmitting).toHaveBeenCalledWith(true)
    expect(mutations[0].mutate).toHaveBeenCalledWith({
      body: {
        name: 'Netflix',
        category_id: 'cat-001',
        date: '2026-05-21T00:00:00Z',
        amount: -15.99,
        recurring: true,
      },
    })
  })

  it('submit with hasErrors=true: calls triggerValidation and does not call mutate', async () => {
    const params = createMockParams()
    params.formBridge.hasErrors.mockReturnValue(true)
    const { result } = renderHook(() => useTransactionCrud(params))

    act(() => {
      result.current.handleAdd()
    })

    const addConfig = params.modal.open.mock.calls[0][0] as {
      actions: { onPress: () => Promise<void> }[]
    }
    await act(async () => {
      await addConfig.actions[0].onPress()
    })

    expect(params.formBridge.triggerValidation).toHaveBeenCalled()
    expect(mutations[0].mutate).not.toHaveBeenCalled()
  })

  it('submit with getFormData returning null: does not call mutate', async () => {
    const params = createMockParams()
    params.formBridge.getFormData.mockReturnValue(null)
    const { result } = renderHook(() => useTransactionCrud(params))

    act(() => {
      result.current.handleAdd()
    })

    const addConfig = params.modal.open.mock.calls[0][0] as {
      actions: { onPress: () => Promise<void> }[]
    }
    await act(async () => {
      await addConfig.actions[0].onPress()
    })

    expect(mutations[0].mutate).not.toHaveBeenCalled()
  })

  it('submit with amount="0": does not call mutate', async () => {
    const params = createMockParams()
    params.formBridge.getFormData.mockReturnValue({
      ...VALID_FORM_DATA,
      amount: '0',
    })
    const { result } = renderHook(() => useTransactionCrud(params))

    act(() => {
      result.current.handleAdd()
    })

    const addConfig = params.modal.open.mock.calls[0][0] as {
      actions: { onPress: () => Promise<void> }[]
    }
    await act(async () => {
      await addConfig.actions[0].onPress()
    })

    expect(mutations[0].mutate).not.toHaveBeenCalled()
  })

  it('submit with amount="abc" (NaN): does not call mutate', async () => {
    const params = createMockParams()
    params.formBridge.getFormData.mockReturnValue({
      ...VALID_FORM_DATA,
      amount: 'abc',
    })
    const { result } = renderHook(() => useTransactionCrud(params))

    act(() => {
      result.current.handleAdd()
    })

    const addConfig = params.modal.open.mock.calls[0][0] as {
      actions: { onPress: () => Promise<void> }[]
    }
    await act(async () => {
      await addConfig.actions[0].onPress()
    })

    expect(mutations[0].mutate).not.toHaveBeenCalled()
  })

  it('handleEdit opens modal with edit config and converts amount to string', () => {
    const params = createMockParams()
    const { result } = renderHook(() => useTransactionCrud(params))

    act(() => {
      result.current.handleEdit(TRANSACTION_FIXTURE)
    })

    expect(params.modal.open).toHaveBeenCalledTimes(1)
    const config = params.modal.open.mock.calls[0][0] as { title: string }
    expect(config.title).toBe('Edit')
  })

  it('edit submit happy path: calls update mutate with path.id and body', async () => {
    const params = createMockParams()
    const { result } = renderHook(() => useTransactionCrud(params))

    act(() => {
      result.current.handleEdit(TRANSACTION_FIXTURE)
    })

    const editConfig = params.modal.open.mock.calls[0][0] as {
      actions: { onPress: () => Promise<void> }[]
    }
    await act(async () => {
      await editConfig.actions[0].onPress()
    })

    expect(mutations[1].mutate).toHaveBeenCalledWith({
      path: { id: 'txn-1' },
      body: {
        name: 'Netflix',
        category_id: 'cat-001',
        date: '2026-05-21T00:00:00Z',
        amount: -15.99,
        recurring: true,
      },
    })
  })

  it('handleDelete opens modal with delete config', () => {
    const params = createMockParams()
    const { result } = renderHook(() => useTransactionCrud(params))

    act(() => {
      result.current.handleDelete(TRANSACTION_FIXTURE)
    })

    expect(params.modal.open).toHaveBeenCalledTimes(1)
    const config = params.modal.open.mock.calls[0][0] as { title: string }
    expect(config.title).toBe('Delete')
  })

  it('delete confirm: calls setSubmitting and delete mutate with path.id', async () => {
    const params = createMockParams()
    const { result } = renderHook(() => useTransactionCrud(params))

    act(() => {
      result.current.handleDelete(TRANSACTION_FIXTURE)
    })

    const deleteConfig = params.modal.open.mock.calls[0][0] as {
      actions: { onPress: () => Promise<void> }[]
    }
    await act(async () => {
      await deleteConfig.actions[0].onPress()
    })

    expect(params.modal.setSubmitting).toHaveBeenCalledWith(true)
    expect(mutations[2].mutate).toHaveBeenCalledWith({ path: { id: 'txn-1' } })
  })

  it('onSuccess (create): invalidates transactions and recurring, closes modal, shows success', () => {
    const params = createMockParams()
    renderHook(() => useTransactionCrud(params))

    const onSuccess = mutations[0].opts.onSuccess as () => void
    act(() => {
      onSuccess()
    })

    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ['transactions'],
    })
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ['recurring'],
    })
    expect(params.modal.close).toHaveBeenCalled()
    expect(params.showSuccess).toHaveBeenCalled()
  })

  it('onError (create): closes modal and shows error', () => {
    const params = createMockParams()
    renderHook(() => useTransactionCrud(params))

    const onError = mutations[0].opts.onError as () => void
    act(() => {
      onError()
    })

    expect(params.modal.close).toHaveBeenCalled()
    expect(params.showError).toHaveBeenCalled()
  })
})
