import { useMemo } from 'react'
import { View } from 'react-native'

import tw from '../../../lib/tw'
import { Button } from '../../atoms/Button/Button.native'
import { Icon } from '../../atoms/Icon/Icon.native'
import { Typography } from '../../atoms/Typography/Typography.native'

import { getCompactRange } from './Pagination.constants'
import styles from './Pagination.styles'

import type { IPaginationProps } from './Pagination'
import type { PageItem } from './Pagination.constants'

/** Compact pagination control for React Native. Always uses the ellipsis layout. */
export function Pagination({
  canNextPage,
  canPreviousPage,
  countPages,
  currentPage,
  gotoNext,
  gotoPrevious,
  handleChangePage,
  prevAriaLabel = 'Previous page',
  nextAriaLabel = 'Next page',
  pageAriaLabel = (n) => `Page ${String(n)}`,
}: IPaginationProps) {
  const pages: PageItem[] = useMemo(
    () => getCompactRange(countPages, currentPage),
    [countPages, currentPage]
  )

  return (
    <View style={tw`${styles.root} justify-center gap-2`}>
      {/* Previous arrow */}
      <Button
        variant="outline"
        size="sm"
        onPress={gotoPrevious}
        disabled={!canPreviousPage}
        accessibilityLabel={prevAriaLabel}
      >
        <Icon name="caretLeft" iconSize="xxs" style={tw`${styles.iconColor}`} />
      </Button>

      {/* Page buttons */}
      <View style={tw`${styles.pageContainer}`}>
        {pages.map((item, index) =>
          item === 'ellipsis' ? (
            <View
              key={`ellipsis-${String(index)}`}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              style={tw`h-10 w-10 items-center justify-center`}
            >
              <Typography variant="body" color="muted">
                ...
              </Typography>
            </View>
          ) : (
            <Button
              key={item}
              variant={currentPage === item ? 'primary' : 'outline'}
              size="sm"
              onPress={() => {
                if (currentPage !== item) handleChangePage(item)
              }}
              accessibilityLabel={pageAriaLabel(item + 1)}
            >
              <Typography
                variant={currentPage === item ? 'body-bold' : 'body'}
                color={currentPage === item ? 'on-dark' : 'foreground'}
              >
                {item + 1}
              </Typography>
            </Button>
          )
        )}
      </View>

      {/* Next arrow */}
      <Button
        variant="outline"
        size="sm"
        onPress={gotoNext}
        disabled={!canNextPage}
        accessibilityLabel={nextAriaLabel}
      >
        <Icon
          name="caretRight"
          iconSize="xxs"
          style={tw`${styles.iconColor}`}
        />
      </Button>
    </View>
  )
}
