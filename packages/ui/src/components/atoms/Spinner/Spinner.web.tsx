import type { ISpinnerProps } from './Spinner'

/** Web implementation of the Spinner — CSS border + animate-spin. */
export function Spinner({ size = 40, color }: Readonly<ISpinnerProps>) {
  const borderWidth = Math.max(3, Math.round(size / 10))
  const resolvedColor = color ?? '#201f24'

  return (
    <div
      role="status"
      aria-label="Loading"
      style={{
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          borderWidth,
          borderStyle: 'solid',
          borderColor: `${resolvedColor}33`,
          borderTopColor: resolvedColor,
          borderRightColor: resolvedColor,
          borderBottomColor: resolvedColor,
          animation: 'spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        }}
      />
    </div>
  )
}
