import { Button, Tooltip, Typography } from '@financial-app/ui'
import { useRef, useState } from 'react'

import type { ITooltipProps, TooltipPlacement } from '@financial-app/ui'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

/** No-op press handler for demo buttons. */
const noop = () => undefined

/** Disable all controls for static stories. */
const NO_CONTROLS = {
  visible: { table: { disable: true } },
  placement: { table: { disable: true } },
  variant: { table: { disable: true } },
  offset: { table: { disable: true } },
  content: { table: { disable: true } },
  width: { table: { disable: true } },
} as const

/** Wrapper that provides a target ref for target-mode stories. */
function TargetModeTooltip(props: Omit<ITooltipProps, 'targetRef' | 'mode'>) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 300,
      }}
    >
      <div ref={ref}>
        <Button title="Target element" onPress={noop} variant="primary" />
      </div>
      <Tooltip {...props} mode="target" targetRef={ref} />
    </div>
  )
}

/** Single placement + variant demo cell for Showcase grid. */
function PlacementDemo({
  placement,
  variant,
}: Readonly<{
  placement: TooltipPlacement
  variant: 'dark' | 'light'
}>) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 160,
        minWidth: 220,
      }}
    >
      <div ref={ref}>
        <Button title={placement} onPress={noop} variant="outline" />
      </div>
      <Tooltip
        mode="target"
        targetRef={ref}
        visible
        placement={placement}
        variant={variant}
        content={
          <Typography variant="body" color="inherit">
            {placement}
          </Typography>
        }
        accessibilityLabel={`${variant} ${placement}`}
      />
    </div>
  )
}

/** Multiline demo with fixed-width tooltip. */
function MultilineDemo() {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 300,
      }}
    >
      <div ref={ref}>
        <Button title="Hover zone" onPress={noop} variant="primary" />
      </div>
      <Tooltip
        mode="target"
        targetRef={ref}
        visible
        placement="bottom"
        variant="dark"
        width={220}
        content={
          <Typography variant="body" color="inherit">
            This tooltip has a fixed width of 220px. The text wraps
            automatically across multiple lines.
          </Typography>
        }
        accessibilityLabel="Multiline tooltip"
      />
    </div>
  )
}

/** Toggle visibility demo with button control. */
function ToggleDemo() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        paddingTop: 100,
      }}
    >
      <div ref={ref}>
        <Button
          title={visible ? 'Hide tooltip' : 'Show tooltip'}
          onPress={() => {
            setVisible((v) => !v)
          }}
          variant="secondary"
        />
      </div>
      <Tooltip
        mode="target"
        targetRef={ref}
        visible={visible}
        placement="bottom"
        variant="dark"
        content={
          <Typography variant="body" color="inherit">
            Controlled visibility
          </Typography>
        }
        accessibilityLabel="Toggle tooltip"
      />
    </div>
  )
}

const meta = {
  title: 'Web/Design System/Atoms/Tooltip',
  component: Tooltip,
  argTypes: {
    variant: {
      control: 'select',
      options: ['dark', 'light'],
    },
    placement: {
      control: 'select',
      options: [
        'top',
        'top-left',
        'top-right',
        'bottom',
        'bottom-left',
        'bottom-right',
        'left',
        'left-top',
        'left-bottom',
        'right',
        'right-top',
        'right-bottom',
      ] satisfies TooltipPlacement[],
    },
    offset: { control: { type: 'range', min: 0, max: 40, step: 2 } },
    visible: { control: 'boolean' },
    content: { control: 'text' },
    width: { control: { type: 'number' } },
  },
  args: {
    visible: true,
    placement: 'bottom',
    variant: 'dark',
    offset: 10,
    content: 'This is a tooltip',
  },
  parameters: {
    backgrounds: 'light',
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground — change placement, variant, offset and content via controls. */
export const Playground: Story = {
  render: (args) => (
    <TargetModeTooltip
      content={
        <Typography variant="body" color="inherit">
          {args.content as string}
        </Typography>
      }
      visible={args.visible}
      placement={args.placement}
      variant={args.variant}
      offset={args.offset}
      width={args.width}
      accessibilityLabel="Tooltip playground"
    />
  ),
}

/** All 12 placements grouped by primary axis, for each variant (dark, light). */
export const Showcase: Story = {
  argTypes: NO_CONTROLS,
  render: () => {
    const groups: { label: string; placements: TooltipPlacement[] }[] = [
      { label: 'top', placements: ['top', 'top-left', 'top-right'] },
      {
        label: 'bottom',
        placements: ['bottom', 'bottom-left', 'bottom-right'],
      },
      { label: 'left', placements: ['left', 'left-top', 'left-bottom'] },
      {
        label: 'right',
        placements: ['right', 'right-top', 'right-bottom'],
      },
    ]
    const variants = ['dark', 'light'] as const

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 80,
          padding: 100,
        }}
      >
        {variants.map((variant) => (
          <div key={variant}>
            <Typography variant="subsection-title">
              {`variant: ${variant}`}
            </Typography>
            {groups.map((group) => (
              <div key={group.label} style={{ marginTop: 32 }}>
                <Typography variant="body">{group.label}</Typography>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 100,
                    marginTop: 16,
                  }}
                >
                  {group.placements.map((placement) => (
                    <PlacementDemo
                      key={placement}
                      placement={placement}
                      variant={variant}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  },
}

/** Fixed-width tooltip with multiline text. */
export const Multiline: Story = {
  argTypes: NO_CONTROLS,
  render: () => <MultilineDemo />,
}

/** Two tooltips placed at fixed coordinates (no target element). */
export const ManualMode: Story = {
  argTypes: NO_CONTROLS,
  render: () => (
    <div style={{ position: 'relative', minHeight: 300, padding: 40 }}>
      <Typography variant="body">
        Tooltips positioned via explicit top/left coordinates (no target
        element).
      </Typography>
      <Tooltip
        mode="manual"
        visible
        position={{ top: 80, left: 40 }}
        variant="dark"
        content={
          <Typography variant="body" color="inherit">
            Dark — manual position
          </Typography>
        }
        accessibilityLabel="Manual dark tooltip"
      />
      <Tooltip
        mode="manual"
        visible
        position={{ top: 80, left: 300 }}
        variant="light"
        content={
          <Typography variant="body" color="inherit">
            Light — manual position
          </Typography>
        }
        accessibilityLabel="Manual light tooltip"
      />
    </div>
  ),
}

/** Click the button to show/hide the tooltip. */
export const ToggleVisibility: Story = {
  argTypes: NO_CONTROLS,
  render: () => <ToggleDemo />,
}
