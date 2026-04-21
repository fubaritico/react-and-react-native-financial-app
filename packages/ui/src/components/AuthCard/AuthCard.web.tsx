import type { IAuthCardProps } from './AuthCard'

/** Web implementation of the AuthCard component. */
export const AuthCard = ({ title, children, footer }: IAuthCardProps) => (
  <div className="bg-white rounded-lg px-8 py-8 flex flex-col gap-8 w-full max-w-md shadow-lg">
    <h1 className="text-2xl font-bold text-grey-900">{title}</h1>
    <div className="flex flex-col gap-4">{children}</div>
    {footer ? <div>{footer}</div> : null}
  </div>
)
