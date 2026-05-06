/** Jest mock for @financial-app/http-client — stubs all option factories */
const emptyOptions = () => ({ queryKey: ['mock'], queryFn: () => Promise.resolve(null) })

module.exports = {
  getBalanceOptions: emptyOptions,
  getBudgetsOptions: emptyOptions,
  getPotsOptions: emptyOptions,
  getRecurringBillsOptions: emptyOptions,
  getTransactionsOptions: emptyOptions,
}
