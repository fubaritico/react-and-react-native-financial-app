import { Pagination } from '@financial-app/ui/native'
import i18n from 'i18next'
import { useState } from 'react'
import { Text, View } from 'react-native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Native/Design System/Molecules/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    backgrounds: 'white',
  },
  tags: ['autodocs'],
  argTypes: {
    countPages: { control: { type: 'number', min: 1, max: 20 } },
    currentPage: { control: { type: 'number', min: 0, max: 19 } },
    canPreviousPage: { control: 'boolean' },
    canNextPage: { control: 'boolean' },
  },
  args: {
    countPages: 5,
    currentPage: 1,
    canPreviousPage: true,
    canNextPage: true,
    gotoFirst: () => undefined,
    gotoLast: () => undefined,
    gotoNext: () => undefined,
    gotoPrevious: () => undefined,
    handleChangePage: () => undefined,
    prevAriaLabel: i18n.t('pagination.previousPage'),
    nextAriaLabel: i18n.t('pagination.nextPage'),
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}

/** First page — previous disabled. */
export const FirstPage: Story = {
  args: {
    countPages: 5,
    currentPage: 0,
    canPreviousPage: false,
    canNextPage: true,
  },
}

/** Last page — next disabled. */
export const LastPage: Story = {
  args: {
    countPages: 5,
    currentPage: 4,
    canPreviousPage: true,
    canNextPage: false,
  },
}

/** Single page — all navigation disabled. */
export const OnePage: Story = {
  args: {
    countPages: 1,
    currentPage: 0,
    canPreviousPage: false,
    canNextPage: false,
  },
}

/** Many pages — sliding window in action. */
export const ManyPages: Story = {
  args: {
    countPages: 10,
    currentPage: 5,
    canPreviousPage: true,
    canNextPage: true,
  },
}

function ControlledPagination() {
  const totalPages = 10
  const [page, setPage] = useState(0)

  return (
    <View style={{ alignItems: 'center', gap: 16 }}>
      <Pagination
        countPages={totalPages}
        currentPage={page}
        canPreviousPage={page > 0}
        canNextPage={page < totalPages - 1}
        gotoFirst={() => {
          setPage(0)
        }}
        gotoLast={() => {
          setPage(totalPages - 1)
        }}
        gotoPrevious={() => {
          setPage((p) => Math.max(0, p - 1))
        }}
        gotoNext={() => {
          setPage((p) => Math.min(totalPages - 1, p + 1))
        }}
        handleChangePage={setPage}
        prevAriaLabel={i18n.t('pagination.previousPage')}
        nextAriaLabel={i18n.t('pagination.nextPage')}
        pageAriaLabel={(n) => i18n.t('pagination.page', { number: n })}
      />
      <Text style={{ fontFamily: 'monospace', fontSize: 12, color: '#696868' }}>
        Page {page + 1} of {totalPages}
      </Text>
    </View>
  )
}

/** Fully interactive with working state. */
export const Controlled: Story = {
  render: () => <ControlledPagination />,
}
