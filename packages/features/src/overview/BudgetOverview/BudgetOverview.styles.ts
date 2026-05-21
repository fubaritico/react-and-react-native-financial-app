/** Shared layout classes for BudgetOverview inner elements (safe for both native and web) */
export const shared = {
  /** Header row: flex-row for native direction, web adds display:flex via cn */
  header: 'flex-row justify-between items-center mb-3',
  /** Overview content button if there's no data */
  noDataButton:
    'block w-full rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-900',
  /** Overview content if there's no data */
  noData:
    'flex flex-col justify-center items-center gap-4 bg-beige-100 p-8 rounded-md',
} as const

/** Web-only classes for BudgetOverview — responsive: vertical mobile, horizontal md+ */
export const web = {
  /** Main content: vertical on mobile, horizontal on md+ */
  content: 'flex flex-col items-center md:flex-row md:items-start md:gap-8',
  /** Chart container: will occupy available space on tablet and mobile, budgetList is pushed to the right */
  chart: 'flex justify-center md:flex-1',
  /** Budget list block: full width below chart on mobile, flex-1 beside chart on md+ */
  budgetList:
    'flex flex-col w-full md:mt-0 md:self-stretch md:justify-between md:flex-[0_1]',
  /** Budget list block when displaying spending */
  spendingList:
    'flex flex-col w-full md:mt-0 md:self-stretch md:justify-between mt-8',
  /** Legend grid (Overview mode, no spending): 2-col grid on mobile, vertical list on md+ */
  legendOverview:
    'grid grid-cols-2 gap-x-4 gap-y-2 mt-6 w-full md:flex md:flex-col md:mt-0 md:self-stretch md:flex-1 md:justify-between',
  /** Legend list (Budget page mode, with spending): full-width vertical list */
  legendSpending: 'flex flex-col w-full',
  /** Spending list item padding */
  spendingItem: 'py-3 first:pt-0 last:pb-0',
} as const

/** Native-only classes for BudgetOverview */
export const native = {
  /** Chart wrapper in vertical mode: centers donut horizontally */
  chartVertical: 'items-center',
  /** Legend item padding in horizontal or spending mode */
  legendItem: 'py-2',
  /** Horizontal layout: chart left + legend right (tablet) */
  horizontal: 'flex-row items-start gap-8',
  /** Chart wrapper in horizontal mode: fills available space, centers donut */
  chartHorizontal: 'flex-1 items-center justify-center',
  /** Outer legend wrapper: no grow, can shrink, stretches vertically (mirrors web flex-[0_1]) */
  budgetListHorizontal: 'grow-0 shrink self-stretch justify-between',
  /** Inner legend list: fills outer wrapper vertically, spaces items */
  legendHorizontal: 'flex-1 self-stretch justify-between',
  /** Legend items 2-col grid wrapper (phone) */
  legendGrid: 'flex-row flex-wrap mt-6',
  /** Single grid item taking half width */
  legendGridItem: 'w-1/2 py-2',
  /** Legend vertical list wrapper */
  legendList: 'mt-6',
} as const
