import type { IconName } from '@financial-app/icons'
import type { IDropdownOption } from '@financial-app/ui'

/** All category icon names available for selection. */
export const CATEGORY_ICON_NAMES: readonly IconName[] = [
  'categoryGeneral',
  'categoryDiningOut',
  'categoryGroceries',
  'categoryEntertainment',
  'categoryTransportation',
  'categoryLifeStyle',
  'categoryPersonalCare',
  'categoryEducation',
  'categoryBills',
  'categoryShopping',
  'categoryBoatBus',
  'categoryCafe',
  'categoryCarRepair',
  'categoryCheckroom',
  'categoryChefHat',
  'categoryChild',
  'categoryCinema',
  'categoryComputing',
  'categoryCreditCard',
  'categoryDelivery',
  'categoryDentistry',
  'categoryDiy',
  'categoryHealth',
  'categoryHomeSweetHome',
  'categoryInternet',
  'categoryKey',
  'categoryLandscape',
  'categoryLiquor',
  'categoryPhone',
  'categoryPhotograph',
  'categoryPlane',
  'categoryRestaurant',
  'categorySettings',
  'categorySkiing',
  'categorySports',
] as const

/** Palette colors available for category creation as dropdown options. */
export const PALETTE_COLORS: IDropdownOption[] = [
  { value: 'green', label: 'Green' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'cyan', label: 'Cyan' },
  { value: 'navy', label: 'Navy' },
  { value: 'red', label: 'Red' },
  { value: 'purple', label: 'Purple' },
  { value: 'pink', label: 'Pink' },
  { value: 'turquoise', label: 'Turquoise' },
  { value: 'brown', label: 'Brown' },
  { value: 'magenta', label: 'Magenta' },
  { value: 'blue', label: 'Blue' },
  { value: 'navy-grey', label: 'Navy Grey' },
  { value: 'army-green', label: 'Army Green' },
  { value: 'gold', label: 'Gold' },
  { value: 'orange', label: 'Orange' },
]

/** Maximum length for a category name. */
export const MAX_CATEGORY_NAME_LENGTH = 50
