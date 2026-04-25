import { useEffect, useMemo, useState } from 'react'

import { cn } from '../../../lib/cn'
import { Button } from '../../atoms/Button/Button.web'
import { Icon } from '../../atoms/Icon/Icon.web'
import { Typography } from '../../atoms/Typography/Typography.web'

import { getCompactRange, getFullRange } from './Pagination.constants'
import styles from './Pagination.styles'

import type { IPaginationProps } from './Pagination'
import type { PageItem } from './Pagination.constants'

/** Responsive pagination control. Full sliding window on desktop, compact with ellipsis on mobile. */
export function Pagination({
  canNextPage,
  canPreviousPage,
  countPages,
  currentPage,
  gotoNext,
  gotoPrevious,
  handleChangePage,
  prevLabel = 'Prev',
  nextLabel = 'Next',
  prevAriaLabel = 'Previous page',
  nextAriaLabel = 'Next page',
  pageAriaLabel = (n) => `Page ${String(n)}`,
}: IPaginationProps) {
  const [isCompact, setIsCompact] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsCompact(mq.matches)

    const handler = (e: MediaQueryListEvent) => {
      setIsCompact(e.matches)
    }
    mq.addEventListener('change', handler)
    return () => {
      mq.removeEventListener('change', handler)
    }
  }, [])

  const pages: (number | PageItem)[] = useMemo(
    () =>
      isCompact
        ? getCompactRange(countPages, currentPage)
        : getFullRange(countPages, currentPage),
    [countPages, currentPage, isCompact]
  )

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        styles.root,
        'flex justify-center gap-2 md:justify-between md:gap-0'
      )}
    >
      {/* Previous */}
      {isCompact ? (
        <Button
          variant="outline"
          size="sm"
          onPress={gotoPrevious}
          disabled={!canPreviousPage}
          accessibilityLabel={prevAriaLabel}
        >
          <Icon name="caretLeft" iconSize="xxs" className={styles.iconColor} />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="nav"
          onPress={gotoPrevious}
          disabled={!canPreviousPage}
          accessibilityLabel={prevAriaLabel}
        >
          <Icon name="caretLeft" iconSize="xxs" className={styles.iconColor} />
          <Typography variant="body" as="span">
            {prevLabel}
          </Typography>
        </Button>
      )}

      {/* Page buttons */}
      <div className={cn(styles.pageContainer, 'flex')}>
        {pages.map((item, index) =>
          item === 'ellipsis' ? (
            <span
              key={`ellipsis-${String(index)}`}
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center"
            >
              <Typography variant="body" color="muted" as="span">
                ...
              </Typography>
            </span>
          ) : (
            <Button
              key={item}
              variant={currentPage === item ? 'primary' : 'outline'}
              size="sm"
              onPress={() => {
                if (currentPage !== item) handleChangePage(item)
              }}
              accessibilityLabel={pageAriaLabel(item + 1)}
              ariaCurrent={currentPage === item ? 'page' : undefined}
            >
              <Typography
                variant={currentPage === item ? 'body-bold' : 'body'}
                color={currentPage === item ? 'on-dark' : 'foreground'}
                as="span"
              >
                {item + 1}
              </Typography>
            </Button>
          )
        )}
      </div>

      {/* Next */}
      {isCompact ? (
        <Button
          variant="outline"
          size="sm"
          onPress={gotoNext}
          disabled={!canNextPage}
          accessibilityLabel={nextAriaLabel}
        >
          <Icon name="caretRight" iconSize="xxs" className={styles.iconColor} />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="nav"
          onPress={gotoNext}
          disabled={!canNextPage}
          accessibilityLabel={nextAriaLabel}
        >
          <Typography variant="body" as="span">
            {nextLabel}
          </Typography>
          <Icon name="caretRight" iconSize="xxs" className={styles.iconColor} />
        </Button>
      )}
    </nav>
  )
}
