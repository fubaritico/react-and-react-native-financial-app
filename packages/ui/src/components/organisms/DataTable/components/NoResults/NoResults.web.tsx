import { Typography } from '#Atoms/index.web'

import type { INoResultsProps } from './NoResults.tsx'

/**
 * Empty state placeholder for DataTable (web).
 * Renders a table row with full-width colspan.
 */
export function NoResults({
  message = 'No results.',
  columnLength,
}: Readonly<INoResultsProps>) {
  return (
    <tr>
      <td colSpan={columnLength} className="py-8 text-center">
        <Typography variant="body" color="muted">
          {message}
        </Typography>
      </td>
    </tr>
  )
}
