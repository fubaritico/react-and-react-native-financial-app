import { cn } from '#Lib/cn'

import { Typography } from '#Atoms/index.web'

import { shared, web } from './AuthCard.styles'

import type { IAuthCardProps } from './AuthCard'

/** Web implementation of the AuthCard component. */
export const AuthCard = ({
  title,
  children,
  footer,
}: Readonly<IAuthCardProps>) => (
  <div className={cn(shared.root, web.root)}>
    <Typography variant="heading-lg" as="h1">
      {title}
    </Typography>
    <div className={cn('flex flex-col', shared.childrenWrap)}>{children}</div>
    {footer ? <div>{footer}</div> : null}
  </div>
)
