/**
 * Transactions page — protected route (auth guard commented out during Phase 7).
 * Placeholder until the full transactions list + search/filter is built.
 */
export default function Transactions() {
  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-preset-1 text-foreground mb-6">Transactions</h1>
      <div className="bg-card rounded-xl p-6">
        <p className="text-preset-4 text-foreground-muted">
          Paginated transaction list with search, sort, and category filter will
          be built here.
        </p>
      </div>
    </div>
  )
}
