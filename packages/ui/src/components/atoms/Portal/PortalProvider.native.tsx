import { Fragment, useCallback, useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { PortalContext } from './PortalContext'

import type { ReactNode } from 'react'

/**
 * PortalProvider — wraps the app root on native.
 * Renders portal content in an absolutely positioned layer above all other content.
 * Used by BottomSheet, Modal, and any overlay that needs full-screen coverage.
 */
export function PortalProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [portals, setPortals] = useState<Map<string, ReactNode>>(new Map())

  const setContent = useCallback((key: string, content: ReactNode | null) => {
    setPortals((prev) => {
      const next = new Map(prev)
      if (content === null) {
        next.delete(key)
      } else {
        next.set(key, content)
      }
      return next
    })
  }, [])

  const contextValue = useMemo(() => ({ setContent }), [setContent])

  return (
    <PortalContext.Provider value={contextValue}>
      <View data-name="portal-root" style={styles.root}>
        {children}
        {portals.size > 0 && (
          <View
            data-name="portal-layer"
            style={styles.portalLayer}
            pointerEvents="box-none"
          >
            {Array.from(portals.entries()).map(([key, node]) => (
              <Fragment key={key}>{node}</Fragment>
            ))}
          </View>
        )}
      </View>
    </PortalContext.Provider>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  portalLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
})
