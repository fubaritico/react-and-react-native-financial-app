import type { IAuthLayoutProps } from './AuthLayout'

/** Web implementation of the AuthLayout component.
 *  Desktop: 2-column (illustration left, form right).
 *  Tablet/Mobile: logo banner top, centered form below.
 */
export const AuthLayout = ({ children }: IAuthLayoutProps) => (
  <div className="min-h-screen bg-beige-100 flex flex-col lg:flex-row">
    {/* Illustration panel — desktop only */}
    <aside className="hidden lg:flex lg:w-[480px] bg-nav-bg rounded-r-lg flex-col justify-between p-10">
      <p className="text-on-dark text-xl font-bold">finance</p>
      <div className="flex-1 flex items-center justify-center">
        {/* Illustration placeholder — replaced with actual image in app */}
        <div className="w-full h-64 rounded-xl bg-grey-500/20" />
      </div>
      <div>
        <h2 className="text-on-dark text-2xl font-bold leading-tight">
          Keep track of your money
          <br />
          and save for your future
        </h2>
        <p className="text-grey-300 text-sm mt-3">
          Personal finance app puts you in control of your spending. Track
          transactions, set budgets, and add to savings pots easily.
        </p>
      </div>
    </aside>

    {/* Logo banner — tablet/mobile only */}
    <header className="lg:hidden bg-nav-bg py-6 px-10 flex items-center justify-center rounded-b-lg">
      <p className="text-on-dark text-xl font-bold">finance</p>
    </header>

    {/* Form area */}
    <main className="flex-1 flex items-center justify-center px-4 py-10">
      {children}
    </main>
  </div>
)
