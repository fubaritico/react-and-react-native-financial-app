import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const tokens = {
  'Semantic — Backgrounds': {
    background: '#f8f4f0',
    card: '#ffffff',
    'card-dark': '#201f24',
    muted: '#f2f2f2',
  },
  'Semantic — Foreground': {
    foreground: '#201f24',
    'foreground-muted': '#696868',
    'foreground-subtle': '#b3b3b3',
    'on-dark': '#ffffff',
    'on-dark-muted': '#98908b',
  },
  'Semantic — Brand': {
    primary: '#201f24',
    'primary-foreground': '#ffffff',
    secondary: '#f8f4f0',
    'secondary-foreground': '#201f24',
  },
  'Semantic — Status': {
    success: '#277c78',
    'success-foreground': '#ffffff',
    warning: '#cab361',
    'warning-foreground': '#201f24',
    destructive: '#c94736',
    'destructive-foreground': '#ffffff',
  },
  'Semantic — Navigation': {
    'nav-bg': '#201f24',
    'nav-text': '#b3b3b3',
    'nav-active-bg': '#f8f4f0',
    'nav-active-text': '#201f24',
    'nav-accent': '#277c78',
  },
  'Semantic — Borders & Input': {
    border: '#f2f2f2',
    'border-muted': '#98908b',
    input: '#98908b',
  },
  'Semantic — Transactions': {
    'transaction-positive': '#277c78',
    'transaction-negative': '#201f24',
    'recurring-paid': '#277c78',
    'recurring-upcoming': '#cab361',
    'recurring-due-soon': '#82c9d7',
  },
  'Base — Neutrals': {
    white: '#ffffff',
    'grey-100': '#f2f2f2',
    'grey-300': '#b3b3b3',
    'grey-500': '#696868',
    'grey-900': '#201f24',
    'beige-100': '#f8f4f0',
    'beige-500': '#98908b',
  },
  'Base — Palette': {
    green: '#277c78',
    yellow: '#f2cdac',
    cyan: '#82c9d7',
    navy: '#626070',
    red: '#c94736',
    purple: '#826cb0',
    pink: '#af81ba',
    turquoise: '#597c7c',
    brown: '#93674f',
    magenta: '#934f6f',
    blue: '#3f82b2',
    'navy-grey': '#97a0ac',
    'army-green': '#7f9161',
    gold: '#cab361',
    orange: '#be6c49',
  },
}

/** Returns black or white depending on background luminance. */
function contrastText(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.55 ? '#201f24' : '#ffffff'
}

function Swatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 0',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          backgroundColor: hex,
          border: '1px solid #e5e5e5',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize: 9,
            fontWeight: 600,
            color: contrastText(hex),
            letterSpacing: 0.3,
          }}
        >
          Aa
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#201f24' }}>
          {name}
        </span>
        <span
          style={{ fontSize: 11, color: '#696868', fontFamily: 'monospace' }}
        >
          {hex}
        </span>
      </div>
    </div>
  )
}

function ColorPalette() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        maxWidth: 720,
        fontFamily:
          "'Public Sans Variable', 'Public Sans', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      {Object.entries(tokens).map(([group, colors]) => (
        <section key={group}>
          <h3
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#98908b',
              textTransform: 'uppercase',
              letterSpacing: 1.2,
              marginBottom: 8,
              paddingBottom: 8,
              borderBottom: '1px solid #f2f2f2',
            }}
          >
            {group}
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '0 24px',
            }}
          >
            {Object.entries(colors).map(([name, hex]) => (
              <Swatch key={name} name={name} hex={hex} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

const meta = {
  title: 'Web/Design System/Tokens/Colors',
  component: ColorPalette,
  parameters: {
    layout: 'padded',
    backgrounds: 'white',
    controls: { disable: true },
  },
} satisfies Meta<typeof ColorPalette>

export default meta
type Story = StoryObj<typeof meta>

/** Full color palette from @financial-app/tokens. */
export const Palette: Story = {}
