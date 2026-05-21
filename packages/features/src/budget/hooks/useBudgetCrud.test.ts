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
  deleteBudgetsByIdMutation: vi.fn(() => ({})),
  getBudgetsOptions: vi.fn(() => ({ queryKey: ['budgets'] })),
  postBudgetsMutation: vi.fn(() => ({})),
  putBudgetsByIdMutation: vi.fn(() => ({})),
}))

vi.mock('@financial-app/shared', () => ({
  getCurrentBudgetMonth: vi.fn(() => '2026-05'),
}))

vi.mock('../createBudgetModalConfigs', () => ({
  createAddBudgetModalConfig: vi.fn((...args: unknown[]) => ({
    title: 'Add',
    actions: [
      {
        label: 'Add',
        variant: 'primary' as const,
        onPress: args[1] as () => void,
      },
    ],
  })),
  createEditBudgetModalConfig: vi.fn((...args: unknown[]) => ({
    title: 'Edit',
    actions: [
      {
        label: 'Save',
        variant: 'primary' as const,
        onPress: args[1] as () => void,
      },
    ],
  })),
  createDeleteBudgetModalConfig: vi.fn((...args: unknown[]) => ({
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

import { useBudgetCrud } from './useBudgetCrud'

const VALID_FORM_DATA = {
  category: 'Entertainment',
  maximum: '500',
  theme: 'green',
}

const BUDGET_FIXTURE = {
  id: 'b-1',
  category: 'Entertainment',
  maximum: 500,
  spent: 200,
  color: 'green',
  items: [] as unknown[],
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

describe('useBudgetCrud', () => {
  beforeEach(() => {
    mutations = []
    vi.clearAllMocks()
  })

  it('handleAdd opens modal', () => {
    const params = createMockParams()
    const { result } = renderHook(() => useBudgetCrud(params))

    act(() => {
      result.current.handleAdd()
    })

    expect(params.modal.open).toHaveBeenCalledTimes(1)
    const config = params.modal.open.mock.calls[0][0] as { title: string }
    expect(config.title).toBe('Add')
  })

  it('submit happy path: calls create mutate with parsed body and current month', async () => {
    const params = createMockParams()
    const { result } = renderHook(() => useBudgetCrud(params))

    act(() => {
      result.current.handleAdd()
    })

    const addConfig = params.modal.open.mock.calls[0][0] as {
      actions: { onPress: () => Promise<void> }[]
    }
    await act(async () => {
      await addConfig.actions[0].onPress()
    })

    expect(mutations[0].mutate).toHaveBeenCalledWith({
      body: {
        category: 'Entertainment',
        maximum: 500,
        theme: 'green',
        month: '2026-05',
      },
    })
  })

  it('submit with hasErrors=true: calls triggerValidation and does not call mutate', async () => {
    const params = createMockParams()
    params.formBridge.hasErrors.mockReturnValue(true)
    const { result } = renderHook(() => useBudgetCrud(params))

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
    const { result } = renderHook(() => useBudgetCrud(params))

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

  it('submit with maximum="0": does not call mutate', async () => {
    const params = createMockParams()
    params.formBridge.getFormData.mockReturnValue({
      ...VALID_FORM_DATA,
      maximum: '0',
    })
    const { result } = renderHook(() => useBudgetCrud(params))

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

  it('submit with maximum="-5": does not call mutate', async () => {
    const params = createMockParams()
    params.formBridge.getFormData.mockReturnValue({
      ...VALID_FORM_DATA,
      maximum: '-5',
    })
    const { result } = renderHook(() => useBudgetCrud(params))

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

  it('submit with maximum="abc": does not call mutate', async () => {
    const params = createMockParams()
    params.formBridge.getFormData.mockReturnValue({
      ...VALID_FORM_DATA,
      maximum: 'abc',
    })
    const { result } = renderHook(() => useBudgetCrud(params))

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

  it('handleEdit opens modal with initialValues derived from card', () => {
    const params = createMockParams()
    const { result } = renderHook(() => useBudgetCrud(params))

    act(() => {
      result.current.handleEdit(BUDGET_FIXTURE)
    })

    expect(params.modal.open).toHaveBeenCalledTimes(1)
    const config = params.modal.open.mock.calls[0][0] as { title: string }
    expect(config.title).toBe('Edit')
  })

  it('edit submit happy path: calls update mutate with path.id and body', async () => {
    const params = createMockParams()
    const { result } = renderHook(() => useBudgetCrud(params))

    act(() => {
      result.current.handleEdit(BUDGET_FIXTURE)
    })

    const editConfig = params.modal.open.mock.calls[0][0] as {
      actions: { onPress: () => Promise<void> }[]
    }
    await act(async () => {
      await editConfig.actions[0].onPress()
    })

    expect(mutations[1].mutate).toHaveBeenCalledWith(
      expect.objectContaining({ path: { id: 'b-1' } })
    )
  })

  it('handleDelete opens modal with delete config', () => {
    const params = createMockParams()
    const { result } = renderHook(() => useBudgetCrud(params))

    act(() => {
      result.current.handleDelete(BUDGET_FIXTURE)
    })

    expect(params.modal.open).toHaveBeenCalledTimes(1)
    const config = params.modal.open.mock.calls[0][0] as { title: string }
    expect(config.title).toBe('Delete')
  })

  it('delete confirm: calls delete mutate with path.id', async () => {
    const params = createMockParams()
    const { result } = renderHook(() => useBudgetCrud(params))

    act(() => {
      result.current.handleDelete(BUDGET_FIXTURE)
    })

    const deleteConfig = params.modal.open.mock.calls[0][0] as {
      actions: { onPress: () => Promise<void> }[]
    }
    await act(async () => {
      await deleteConfig.actions[0].onPress()
    })

    expect(mutations[2].mutate).toHaveBeenCalledWith({ path: { id: 'b-1' } })
  })

  it('onSuccess: invalidates budgets, closes modal, shows success', () => {
    const params = createMockParams()
    renderHook(() => useBudgetCrud(params))

    const onSuccess = mutations[0].opts.onSuccess as () => void
    act(() => {
      onSuccess()
    })

    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ['budgets'],
    })
    expect(params.modal.close).toHaveBeenCalled()
    expect(params.showSuccess).toHaveBeenCalled()
  })

  it('onError: closes modal and shows error', () => {
    const params = createMockParams()
    renderHook(() => useBudgetCrud(params))

    const onError = mutations[0].opts.onError as () => void
    act(() => {
      onError()
    })

    expect(params.modal.close).toHaveBeenCalled()
    expect(params.showError).toHaveBeenCalled()
  })
})
