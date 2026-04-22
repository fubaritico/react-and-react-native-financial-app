/**
 * Recurring Bills page — protected route (auth guard commented out during Phase 7).
 * Placeholder until the bills list with status indicators + search/sort is built.
 */
export default function RecurringBills() {
  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-preset-1 text-grey-900 mb-6">Recurring Bills</h1>
      <div className="bg-white rounded-xl p-6">
        <p className="text-preset-4 text-grey-500">
          Recurring bills with paid/upcoming/due soon status, search, and sort
          will be built here.
        </p>
      </div>
    </div>
  )
}
