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
  deletePotsByIdMutation: vi.fn(() => ({})),
  getPotsOptions: vi.fn(() => ({ queryKey: ['pots'] })),
  postPotsMutation: vi.fn(() => ({})),
  putPotsByIdMutation: vi.fn(() => ({})),
  postPotsByIdAddMutation: vi.fn(() => ({})),
  postPotsByIdWithdrawMutation: vi.fn(() => ({})),
}))

vi.mock('../createPotModalConfigs', () => ({
  createAddPotModalConfig: vi.fn((...args: unknown[]) => ({
    title: 'Add',
    actions: [
      {
        label: 'Add',
        variant: 'primary' as const,
        onPress: args[1] as () => void,
      },
    ],
  })),
  createEditPotModalConfig: vi.fn((...args: unknown[]) => ({
    title: 'Edit',
    actions: [
      {
        label: 'Save',
        variant: 'primary' as const,
        onPress: args[1] as () => void,
      },
    ],
  })),
  createDeletePotModalConfig: vi.fn((...args: unknown[]) => ({
    title: 'Delete',
    actions: [
      {
        label: 'Del',
        variant: 'destroy' as const,
        onPress: args[2] as () => void,
      },
    ],
  })),
  createAddMoneyModalConfig: vi.fn((...args: unknown[]) => ({
    title: 'AddMoney',
    actions: [
      {
        label: 'Confirm',
        variant: 'primary' as const,
        onPress: args[2] as () => void,
      },
    ],
  })),
  createWithdrawModalConfig: vi.fn((...args: unknown[]) => ({
    title: 'Withdraw',
    actions: [
      {
        label: 'Confirm',
        variant: 'primary' as const,
        onPress: args[2] as () => void,
      },
    ],
  })),
}))

import { usePotCrud } from './usePotCrud'

const VALID_FORM_DATA = {
  name: 'Savings',
  target: '2000',
  theme: 'blue',
}

const POT_FIXTURE = {
  id: 'pot-1',
  name: 'Savings',
  target: 2000,
  total: 500,
  theme: 'blue',
}

function createMockParams() {
  return {
    modal: { open: vi.fn(), close: vi.fn(), setSubmitting: vi.fn() },
    formAccessor: {
      getFormData: vi.fn(() => ({ ...VALID_FORM_DATA })),
      hasErrors: vi.fn(() => false),
      triggerValidation: vi.fn(),
    },
    showSuccess: vi.fn(),
    showError: vi.fn(),
    renderForm: vi.fn(() => null),
    renderDeleteBody: vi.fn(() => null),
    renderAmountForm: vi.fn(() => null),
    getAmount: vi.fn(() => 100),
  }
}

describe('usePotCrud', () => {
  beforeEach(() => {
    mutations = []
    vi.clearAllMocks()
  })

  it('handleAdd opens modal', () => {
    const params = createMockParams()
    const { result } = renderHook(() => usePotCrud(params))

    act(() => {
      result.current.handleAdd()
    })

    expect(params.modal.open).toHaveBeenCalledTimes(1)
    const config = params.modal.open.mock.calls[0][0] as { title: string }
    expect(config.title).toBe('Add')
  })

  it('submit happy path: trims name, parses target, calls create mutate', async () => {
    const params = createMockParams()
    const { result } = renderHook(() => usePotCrud(params))

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
        name: 'Savings',
        target: 2000,
        theme: 'blue',
      },
    })
  })

  it('submit with hasErrors=true: calls triggerValidation and does not call mutate', async () => {
    const params = createMockParams()
    params.formAccessor.hasErrors.mockReturnValue(true)
    const { result } = renderHook(() => usePotCrud(params))

    act(() => {
      result.current.handleAdd()
    })

    const addConfig = params.modal.open.mock.calls[0][0] as {
      actions: { onPress: () => Promise<void> }[]
    }
    await act(async () => {
      await addConfig.actions[0].onPress()
    })

    expect(params.formAccessor.triggerValidation).toHaveBeenCalled()
    expect(mutations[0].mutate).not.toHaveBeenCalled()
  })

  it('submit with getFormData returning null: does not call mutate', async () => {
    const params = createMockParams()
    params.formAccessor.getFormData.mockReturnValue(null)
    const { result } = renderHook(() => usePotCrud(params))

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

  it('submit with target="0": does not call mutate', async () => {
    const params = createMockParams()
    params.formAccessor.getFormData.mockReturnValue({
      ...VALID_FORM_DATA,
      target: '0',
    })
    const { result } = renderHook(() => usePotCrud(params))

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

  it('submit with target="abc": does not call mutate', async () => {
    const params = createMockParams()
    params.formAccessor.getFormData.mockReturnValue({
      ...VALID_FORM_DATA,
      target: 'abc',
    })
    const { result } = renderHook(() => usePotCrud(params))

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

  it('submit with whitespace-only name: does not call mutate', async () => {
    const params = createMockParams()
    params.formAccessor.getFormData.mockReturnValue({
      ...VALID_FORM_DATA,
      name: '   ',
    })
    const { result } = renderHook(() => usePotCrud(params))

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

  it('handleEdit opens modal with edit config', () => {
    const params = createMockParams()
    const { result } = renderHook(() => usePotCrud(params))

    act(() => {
      result.current.handleEdit(POT_FIXTURE)
    })

    expect(params.modal.open).toHaveBeenCalledTimes(1)
    const config = params.modal.open.mock.calls[0][0] as { title: string }
    expect(config.title).toBe('Edit')
  })

  it('edit submit happy path: calls update mutate with path.id and body', async () => {
    const params = createMockParams()
    const { result } = renderHook(() => usePotCrud(params))

    act(() => {
      result.current.handleEdit(POT_FIXTURE)
    })

    const editConfig = params.modal.open.mock.calls[0][0] as {
      actions: { onPress: () => Promise<void> }[]
    }
    await act(async () => {
      await editConfig.actions[0].onPress()
    })

    expect(mutations[1].mutate).toHaveBeenCalledWith(
      expect.objectContaining({ path: { id: 'pot-1' } })
    )
  })

  it('handleDelete opens modal with delete config', () => {
    const params = createMockParams()
    const { result } = renderHook(() => usePotCrud(params))

    act(() => {
      result.current.handleDelete(POT_FIXTURE)
    })

    expect(params.modal.open).toHaveBeenCalledTimes(1)
    const config = params.modal.open.mock.calls[0][0] as { title: string }
    expect(config.title).toBe('Delete')
  })

  it('delete confirm: calls delete mutate with path.id', async () => {
    const params = createMockParams()
    const { result } = renderHook(() => usePotCrud(params))

    act(() => {
      result.current.handleDelete(POT_FIXTURE)
    })

    const deleteConfig = params.modal.open.mock.calls[0][0] as {
      actions: { onPress: () => Promise<void> }[]
    }
    await act(async () => {
      await deleteConfig.actions[0].onPress()
    })

    expect(mutations[2].mutate).toHaveBeenCalledWith({ path: { id: 'pot-1' } })
  })

  it('handleAddMoney: opens modal and calls addMoney mutate with amount', async () => {
    const params = createMockParams()
    const { result } = renderHook(() => usePotCrud(params))

    act(() => {
      result.current.handleAddMoney(POT_FIXTURE)
    })

    expect(params.modal.open).toHaveBeenCalledTimes(1)
    const config = params.modal.open.mock.calls[0][0] as {
      title: string
      actions: { onPress: () => Promise<void> }[]
    }
    expect(config.title).toBe('AddMoney')

    await act(async () => {
      await config.actions[0].onPress()
    })

    expect(mutations[3].mutate).toHaveBeenCalledWith({
      path: { id: 'pot-1' },
      body: { amount: 100 },
    })
  })

  it('handleAddMoney with getAmount returning 0: does not call mutate', async () => {
    const params = createMockParams()
    params.getAmount.mockReturnValue(0)
    const { result } = renderHook(() => usePotCrud(params))

    act(() => {
      result.current.handleAddMoney(POT_FIXTURE)
    })

    const config = params.modal.open.mock.calls[0][0] as {
      actions: { onPress: () => Promise<void> }[]
    }
    await act(async () => {
      await config.actions[0].onPress()
    })

    expect(mutations[3].mutate).not.toHaveBeenCalled()
  })

  it('handleWithdraw: opens modal and calls withdraw mutate with amount', async () => {
    const params = createMockParams()
    const { result } = renderHook(() => usePotCrud(params))

    act(() => {
      result.current.handleWithdraw(POT_FIXTURE)
    })

    expect(params.modal.open).toHaveBeenCalledTimes(1)
    const config = params.modal.open.mock.calls[0][0] as {
      title: string
      actions: { onPress: () => Promise<void> }[]
    }
    expect(config.title).toBe('Withdraw')

    await act(async () => {
      await config.actions[0].onPress()
    })

    expect(mutations[4].mutate).toHaveBeenCalledWith({
      path: { id: 'pot-1' },
      body: { amount: 100 },
    })
  })

  it('handleWithdraw with getAmount returning 0: does not call mutate', async () => {
    const params = createMockParams()
    params.getAmount.mockReturnValue(0)
    const { result } = renderHook(() => usePotCrud(params))

    act(() => {
      result.current.handleWithdraw(POT_FIXTURE)
    })

    const config = params.modal.open.mock.calls[0][0] as {
      actions: { onPress: () => Promise<void> }[]
    }
    await act(async () => {
      await config.actions[0].onPress()
    })

    expect(mutations[4].mutate).not.toHaveBeenCalled()
  })

  it('onSuccess (create): invalidates pots, closes modal, shows success', () => {
    const params = createMockParams()
    renderHook(() => usePotCrud(params))

    const onSuccess = mutations[0].opts.onSuccess as () => void
    act(() => {
      onSuccess()
    })

    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['pots'] })
    expect(params.modal.close).toHaveBeenCalled()
    expect(params.showSuccess).toHaveBeenCalled()
  })

  it('onSuccess (update): invalidates pots, closes modal, shows success', () => {
    const params = createMockParams()
    renderHook(() => usePotCrud(params))

    const onSuccess = mutations[1].opts.onSuccess as () => void
    act(() => {
      onSuccess()
    })

    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['pots'] })
    expect(params.modal.close).toHaveBeenCalled()
    expect(params.showSuccess).toHaveBeenCalled()
  })

  it('onSuccess (delete): invalidates pots, closes modal, shows success', () => {
    const params = createMockParams()
    renderHook(() => usePotCrud(params))

    const onSuccess = mutations[2].opts.onSuccess as () => void
    act(() => {
      onSuccess()
    })

    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['pots'] })
    expect(params.modal.close).toHaveBeenCalled()
    expect(params.showSuccess).toHaveBeenCalled()
  })

  it('onSuccess (addMoney): invalidates pots, closes modal, shows success', () => {
    const params = createMockParams()
    renderHook(() => usePotCrud(params))

    const onSuccess = mutations[3].opts.onSuccess as () => void
    act(() => {
      onSuccess()
    })

    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['pots'] })
    expect(params.modal.close).toHaveBeenCalled()
    expect(params.showSuccess).toHaveBeenCalled()
  })

  it('onSuccess (withdraw): invalidates pots, closes modal, shows success', () => {
    const params = createMockParams()
    renderHook(() => usePotCrud(params))

    const onSuccess = mutations[4].opts.onSuccess as () => void
    act(() => {
      onSuccess()
    })

    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['pots'] })
    expect(params.modal.close).toHaveBeenCalled()
    expect(params.showSuccess).toHaveBeenCalled()
  })

  it('onError: closes modal and shows error', () => {
    const params = createMockParams()
    renderHook(() => usePotCrud(params))

    const onError = mutations[0].opts.onError as () => void
    act(() => {
      onError()
    })

    expect(params.modal.close).toHaveBeenCalled()
    expect(params.showError).toHaveBeenCalled()
  })
})
