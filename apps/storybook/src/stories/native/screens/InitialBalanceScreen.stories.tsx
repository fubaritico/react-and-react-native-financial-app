import { InitialBalanceScreen } from '@financial-app/features/native'
import { View } from 'react-native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import type { ReactNode } from 'react'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

/** Token: color.black (#000000) — device bezel simulation */
const DEVICE_FRAME_BG = '#000000'
/** Token: color.beige-100 (#f8f4f0) — app background simulation */
const DEVICE_SCREEN_BG = '#f8f4f0'

/** iPhone 16 Pro screen dimensions */
const IPHONE_WIDTH = 393
const IPHONE_HEIGHT = 852

/** Pixel 9 screen dimensions */
const ANDROID_WIDTH = 412
const ANDROID_HEIGHT = 915

/**
 * Device frame wrapper — dark background with a beige rounded screen.
 * @param props - Frame dimensions and children
 * @returns A simulated device frame
 */
const DeviceFrame = ({
  width,
  height,
  children,
}: {
  /** Frame width in pixels */
  width: number
  /** Frame height in pixels */
  height: number
  /** Screen content */
  children: ReactNode
}) => (
  <View
    style={{
      backgroundColor: DEVICE_FRAME_BG,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <View
      style={{
        width,
        height,
        backgroundColor: DEVICE_SCREEN_BG,
        borderRadius: 20,
        overflow: 'hidden',
      }}
    >
      {children}
    </View>
  </View>
)

const defaultProps = {
  onSubmit: noop,
  onBack: noop,
  isSubmitting: false,
  error: '',
}

const meta = {
  title: 'Native/Screens/InitialBalanceScreen',
  component: InitialBalanceScreen,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta
type Story = StoryObj

/** iPhone 16 Pro — initial balance screen (idle). */
export const IPhone: Story = {
  parameters: { backgrounds: 'dark' },
  render: () => (
    <DeviceFrame width={IPHONE_WIDTH} height={IPHONE_HEIGHT}>
      <InitialBalanceScreen {...defaultProps} />
    </DeviceFrame>
  ),
}

/** Pixel 9 — initial balance screen (idle). */
export const Android: Story = {
  parameters: { backgrounds: 'dark' },
  render: () => (
    <DeviceFrame width={ANDROID_WIDTH} height={ANDROID_HEIGHT}>
      <InitialBalanceScreen {...defaultProps} />
    </DeviceFrame>
  ),
}

/** iPhone 16 Pro — submitting state (button disabled + loading text). */
export const Submitting: Story = {
  parameters: { backgrounds: 'dark' },
  render: () => (
    <DeviceFrame width={IPHONE_WIDTH} height={IPHONE_HEIGHT}>
      <InitialBalanceScreen {...defaultProps} isSubmitting />
    </DeviceFrame>
  ),
}

/** iPhone 16 Pro — server error displayed. */
export const WithError: Story = {
  parameters: { backgrounds: 'dark' },
  render: () => (
    <DeviceFrame width={IPHONE_WIDTH} height={IPHONE_HEIGHT}>
      <InitialBalanceScreen
        {...defaultProps}
        error="Initial balance has already been set"
      />
    </DeviceFrame>
  ),
}
