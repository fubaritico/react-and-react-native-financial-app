// Atoms
export { Icon } from './components/atoms/Icon'
export type { IIconProps } from './components/atoms/Icon/Icon.tsx'
export type { IIconSize } from './components/atoms/Icon/Icon.constants'
export { iconSizeMap } from './components/atoms/Icon/Icon.constants'

export { Typography } from './components/atoms/Typography'
export type {
  ITypographyProps,
  ITypographyNativeProps,
} from './components/atoms/Typography/Typography.tsx'

export { Button } from './components/atoms/Button'
export type { IButtonProps } from './components/atoms/Button/Button.tsx'

export { ColorDot } from './components/atoms/ColorDot'
export type { IColorDotProps } from './components/atoms/ColorDot/ColorDot.tsx'

export { Divider } from './components/atoms/Divider'
export type { IDividerProps } from './components/atoms/Divider/Divider.tsx'

export { Avatar } from './components/atoms/Avatar'
export type { IAvatarProps } from './components/atoms/Avatar/Avatar.tsx'

export { LinkText } from './components/atoms/LinkText'
export type { ILinkTextProps } from './components/atoms/LinkText/LinkText.tsx'

export { NavItem } from './components/atoms/NavItem'
export type { INavItemProps } from './components/atoms/NavItem/NavItem.tsx'

export { DonutChart } from './components/atoms/DonutChart'
export type {
  IDonutChartProps,
  IDonutSegment,
} from './components/atoms/DonutChart/DonutChart.tsx'

export { Currency } from './components/atoms/Currency'
export type { ICurrencyProps } from './components/atoms/Currency/Currency.tsx'

export { ProgressBar } from './components/atoms/ProgressBar'
export type { IProgressBarProps } from './components/atoms/ProgressBar/ProgressBar.tsx'

export { Status } from './components/atoms/Status'
export type { IStatusProps } from './components/atoms/Status/Status.tsx'

export { Skeleton } from './components/atoms/Skeleton'
export type { ISkeletonProps } from './components/atoms/Skeleton/Skeleton.tsx'

export { Spinner } from './components/atoms/Spinner'
export type { ISpinnerProps } from './components/atoms/Spinner/Spinner.tsx'

export { Checkbox } from './components/atoms/Checkbox'
export type { ICheckboxProps } from './components/atoms/Checkbox/Checkbox.tsx'

export { OtpInput } from './components/atoms/OtpInput/index'
export type { IOtpInputProps } from './components/atoms/OtpInput/OtpInput.tsx'

export { Tooltip } from './components/atoms/Tooltip'
export type {
  ITooltipProps,
  TooltipPlacement,
  ITooltipManualPosition,
} from './components/atoms/Tooltip/Tooltip.tsx'

// Molecules
export { TextInput } from './components/molecules/TextInput'
export type { ITextInputProps } from './components/molecules/TextInput/TextInput.tsx'

export { PasswordInput } from './components/molecules/PasswordInput'
export type { IPasswordInputProps } from './components/molecules/PasswordInput/PasswordInput.tsx'

export { PasswordRulesList } from './components/molecules/PasswordRulesList'
export type {
  IPasswordRulesListProps,
  IPasswordRule,
  PasswordRuleState,
} from './components/molecules/PasswordRulesList/PasswordRulesList.tsx'

export { SectionLink } from './components/molecules/SectionLink'
export type { ISectionLinkProps } from './components/molecules/SectionLink/SectionLink.tsx'

export { StatCard } from './components/molecules/StatCard'
export type { IStatCardProps } from './components/molecules/StatCard/StatCard.tsx'

export { BalanceCard } from './components/molecules/BalanceCard'
export type { IBalanceCardProps } from './components/molecules/BalanceCard/BalanceCard.tsx'

export { TransactionRow } from './components/molecules/TransactionRow'
export type { ITransactionRowProps } from './components/molecules/TransactionRow/TransactionRow.tsx'

export { SpendingSummaryRow } from './components/molecules/SpendingSummaryRow'
export type { ISpendingSummaryRowProps } from './components/molecules/SpendingSummaryRow/SpendingSummaryRow.tsx'

export { ColorBarItem } from './components/molecules/ColorBarItem'
export type { IColorBarItemProps } from './components/molecules/ColorBarItem/ColorBarItem.tsx'

export { LatestSpending } from './components/molecules/LatestSpending'
export type {
  ILatestSpendingProps,
  ILatestSpendingItem,
} from './components/molecules/LatestSpending/LatestSpending.tsx'

export { ModeCard } from './components/molecules/ModeCard'
export type { IModeCardProps } from './components/molecules/ModeCard/ModeCard.tsx'

export { BillSummaryRow } from './components/molecules/BillSummaryRow'
export type { IBillSummaryRowProps } from './components/molecules/BillSummaryRow/BillSummaryRow.tsx'

export { Pagination } from './components/molecules/Pagination'
export type { IPaginationProps } from './components/molecules/Pagination/Pagination.tsx'

export { Dropdown } from './components/molecules/Dropdown'
export type {
  IDropdownProps,
  IDropdownOption,
} from './components/molecules/Dropdown/Dropdown.tsx'

export { Menu } from './components/molecules/Menu'
export type {
  IMenuProps,
  IMenuItemProps,
} from './components/molecules/Menu/Menu.tsx'

export { BottomSheet } from './components/molecules/BottomSheet'
export type {
  IBottomSheetProps,
  IBottomSheetHeaderProps,
  IBottomSheetBodyProps,
} from './components/molecules/BottomSheet/BottomSheet.tsx'

export { Alert } from './components/molecules/Alert'
export type {
  IAlertProps,
  AlertSeverity,
} from './components/molecules/Alert/Alert.tsx'

// Atoms
export { Portal, PortalProvider } from './components/atoms/Portal'
export type { IPortalProps } from './components/atoms/Portal/Portal.tsx'

// Organisms
export { DataTable } from './components/organisms/DataTable'
export type { BaseDataTableProps } from './components/organisms/DataTable/DataTable.types'
export {
  SimpleCell,
  AmountCell,
  DateCell,
  AvatarNameCell,
  BillTitleCell,
  CategoryIconCell,
  StatusCell,
  SortableHeader,
  EmptyHeaderCell,
  ActionCell,
} from './components/organisms/DataTable/cells/index'
export type {
  StatusCellFn,
  BillStatus,
  HeaderCellFn,
  HeaderAlign,
  EmptyHeaderCellFn,
  IActionCellConfig,
  ActionCellFn,
} from './components/organisms/DataTable/cells/index'

export { DataTablePagination } from './components/molecules/DataTablePagination'
export type { IDataTablePaginationProps } from './components/molecules/DataTablePagination/DataTablePagination.tsx'

export { Card } from './components/organisms/Card'
export type { ICardProps } from './components/organisms/Card/Card.tsx'

export { Header } from './components/organisms/Header'
export type { IHeaderProps } from './components/organisms/Header/Header.tsx'

export { AuthCard } from './components/organisms/AuthCard'
export type { IAuthCardProps } from './components/organisms/AuthCard/AuthCard.tsx'

export { Modal } from './components/organisms/Modal'
export type {
  IModalProps,
  IModalHeaderProps,
  IModalBodyProps,
  IModalFooterProps,
  IModalFooterAction,
} from './components/organisms/Modal/Modal.tsx'

export { DatePicker } from './components/organisms/DatePicker'
export type { IDatePickerProps } from './components/organisms/DatePicker/DatePicker.tsx'

// Utilities
export { default as tw } from './lib/tw'
export { resolveColor } from './lib/resolveColor'

// Currency context — apps mount a Provider connecting useCurrency().format to this context
export { CurrencyContext, useCurrencyFormat } from './lib/CurrencyContext'
export type { ICurrencyConfig, CurrencySign } from './lib/CurrencyContext'

// Templates
export { AuthLayout } from './components/templates/AuthLayout'
export type { IAuthLayoutProps } from './components/templates/AuthLayout/AuthLayout.tsx'
