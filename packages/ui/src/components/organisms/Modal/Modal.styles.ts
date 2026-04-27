/** Layout-only Tailwind classes for Modal inner elements */
export const modalStyles = {
  /** Header row: title + close button */
  header: 'flex-row items-center justify-between',
  /** Body area with top spacing */
  body: 'mt-5',
  /** Footer area with top spacing */
  footer: 'mt-5 gap-3',
  /** Close button touch target — min 44x44 for WCAG 2.5.8 */
  closeButton: 'items-center justify-center w-11 h-11 rounded-full',
} as const
