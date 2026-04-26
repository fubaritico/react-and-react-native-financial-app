import { useEffect, useRef } from 'react'
import {
  Animated,
  Modal,
  Pressable,
  View,
  useWindowDimensions,
} from 'react-native'

import tw from '../../../lib/tw'

import { drawerVariants } from './Drawer.variants'
import { DrawerBody } from './DrawerBody.native'
import { DrawerContext } from './DrawerContext'
import { DrawerHeader } from './DrawerHeader.native'

import type { IDrawerProps } from './Drawer'

const SLIDE_DURATION = 250

/**
 * Native Drawer — bottom sheet panel rendered in a transparent Modal.
 *
 * Slides up from the bottom of the screen on open. Closes via the
 * close button or overlay tap (when `overlay` is enabled).
 */
function Drawer({
  open,
  onClose,
  variant = 'dark',
  overlay = true,
  children,
  accessibilityLabel,
}: IDrawerProps) {
  const { height } = useWindowDimensions()
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

  if (!open) return null

  return (
    <Modal
      transparent
      animationType="none"
      visible={open}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <DrawerContext.Provider value={{ variant, onClose }}>
        <View
          style={tw`flex-1 justify-end`}
          accessibilityViewIsModal
          accessibilityLabel={accessibilityLabel}
        >
          {overlay && (
            <Pressable
              style={tw`absolute inset-0 bg-black/50`}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={accessibilityLabel ?? 'Close drawer'}
            />
          )}
          <Animated.View
            style={[
              tw`${drawerVariants({ variant })} max-h-[60%]`,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            {children}
          </Animated.View>
        </View>
      </DrawerContext.Provider>
    </Modal>
  )
}

Drawer.Header = DrawerHeader
Drawer.Body = DrawerBody

export { Drawer }
