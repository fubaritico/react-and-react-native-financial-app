import type { SortingState } from '@tanstack/react-table'

/** Maps a sort dropdown value to TanStack Table SortingState. */
export function sortOptionToState(value: string): SortingState {
  switch (value) {
    case 'latest':
      return [{ id: 'date', desc: true }]
    case 'oldest':
      return [{ id: 'date', desc: false }]
    case 'a-z':
      return [{ id: 'name', desc: false }]
    case 'z-a':
      return [{ id: 'name', desc: true }]
    case 'highest':
      return [{ id: 'amount', desc: true }]
    case 'lowest':
      return [{ id: 'amount', desc: false }]
    default:
      return [{ id: 'date', desc: true }]
  }
}

/** Derives the dropdown sort option value from TanStack Table SortingState. */
export function stateToSortOption(sorting: SortingState): string {
  if (sorting.length === 0) return 'latest'
  const { id, desc } = sorting[0]
  if (id === 'date') return desc ? 'latest' : 'oldest'
  if (id === 'name') return desc ? 'z-a' : 'a-z'
  if (id === 'amount') return desc ? 'highest' : 'lowest'
  return 'latest'
}
