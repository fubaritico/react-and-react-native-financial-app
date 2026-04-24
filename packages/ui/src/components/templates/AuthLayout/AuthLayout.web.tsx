import { Typography } from '../../atoms/Typography/Typography.web'

import type { IAuthLayoutProps } from './AuthLayout'

/** Web implementation of the AuthLayout component.
 *  Desktop: 2-column (illustration left, form right).
 *  Tablet/Mobile: logo banner top, centered form below.
 */
export function AuthLayout({
  children,
  appName,
  tagline,
  description,
}: IAuthLayoutProps) {
  return (
    <div className="min-h-screen bg-beige-100 flex flex-col lg:flex-row">
      {/* Illustration panel — desktop only */}
      <aside className="hidden lg:flex lg:w-[480px] bg-nav-bg rounded-r-lg flex-col justify-between p-10">
        <Typography variant="section-title" color="on-dark" as="p">
          {appName}
        </Typography>
        <div className="flex-1 flex items-center justify-center">
          {/* Illustration placeholder — replaced with actual image in app */}
          <div className="w-full h-64 rounded-xl bg-grey-500/20" />
        </div>
        <div>
          {tagline ? (
            <Typography variant="heading-lg" color="on-dark" as="h2">
              {tagline}
            </Typography>
          ) : null}
          {description ? (
            <Typography
              variant="body"
              color="on-dark-muted"
              as="p"
              className="mt-3"
            >
              {description}
            </Typography>
          ) : null}
        </div>
      </aside>

      {/* Logo banner — tablet/mobile only */}
      <header className="lg:hidden bg-nav-bg py-6 px-10 flex items-center justify-center rounded-b-lg">
        <Typography variant="section-title" color="on-dark" as="p">
          {appName}
        </Typography>
      </header>

      {/* Form area */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        {children}
      </main>
    </div>
  )
}
