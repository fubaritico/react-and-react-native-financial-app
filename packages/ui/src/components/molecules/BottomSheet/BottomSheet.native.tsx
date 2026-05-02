import { useCallback, useEffect, useRef } from 'react'
import {
  Animated,
  BackHandler,
  Pressable,
  View,
  useWindowDimensions,
} from 'react-native'

import tw from '#Lib/tw'

import { shared } from './BottomSheet.styles'
import { bottomSheetVariants } from './BottomSheet.variants'
import { BottomSheetBody } from './BottomSheetBody.native'
import { BottomSheetContext } from './BottomSheetContext'
import { BottomSheetHeader } from './BottomSheetHeader.native'

import type { IBottomSheetProps } from './BottomSheet'

import { Portal } from '#Atoms'

const SLIDE_DURATION = 250

/**
 * Native BottomSheet — bottom sheet panel rendered via Portal (absolute layer).
 *
 * Slides up from the bottom of the screen on open. Closes via the
 * close button, overlay tap (when `overlay` is enabled), or Android back button.
 */
function BottomSheet({
  open,
  onClose,
  variant = 'dark',
  overlay = true,
  children,
  accessibilityLabel,
}: Readonly<IBottomSheetProps>) {
  const { height, width } = useWindowDimensions()
  const slideAnim = useRef(new Animated.Value(height)).current

  useEffect(() => {
    if (open) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: SLIDE_DURATION,
        useNativeDriver: true,
      }).start()
    } else {
      slideAnim.setValue(height)
    }
  }, [open, slideAnim, height])

  /** Handle Android hardware back button */
  useEffect(() => {
    if (!open) return
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose()
      return true
    })
    return () => {
      sub.remove()
    }
  }, [open, onClose])

  /** Closes the bottom sheet when overlay is tapped */
  const handleOverlayPress = useCallback(() => {
    onClose()
  }, [onClose])

  if (!open) return null

  return (
    <Portal>
      <BottomSheetContext.Provider value={{ variant, onClose }}>
        <View
          data-name="bottom-sheet-root"
          style={[tw`absolute top-0 left-0`, { width, height }]}
          accessibilityViewIsModal
          accessibilityLabel={accessibilityLabel}
        >
          {/* Overlay — tapping closes the bottom sheet */}
          {overlay && (
            <Pressable
              data-name="bottom-sheet-overlay"
              style={[tw`absolute top-0 left-0 bg-black/50`, { width, height }]}
              onPress={handleOverlayPress}
              accessibilityLabel="Close"
              accessibilityRole="button"
            />
          )}

          {/* Panel */}
          <Animated.View
            data-name="bottom-sheet-panel"
            style={[
              tw`${bottomSheetVariants({ variant })} absolute bottom-0 left-0 right-0 max-h-[60%]`,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View
              style={[
                tw`${shared.knob}`,
                tw`${variant === 'dark' ? 'bg-white/25' : 'bg-black/25'}`,
              ]}
              data-name="bottom-sheet-knob"
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            />
            {children}
          </Animated.View>
        </View>
      </BottomSheetContext.Provider>
    </Portal>
  )
}

BottomSheet.Header = BottomSheetHeader
BottomSheet.Body = BottomSheetBody

export { BottomSheet }
