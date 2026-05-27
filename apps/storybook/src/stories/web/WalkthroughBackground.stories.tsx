import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

/** Multi-gradient background for the walkthrough screen — 3 radial layers on beige-200 base. */
const WALKTHROUGH_BG = `
  radial-gradient(circle at 0% 0%, #98908B99 0%, transparent 55%),
  radial-gradient(circle at 120% 120%, #98908BCC 0%, transparent 55%),
  radial-gradient(circle at 50% 50%, #F8F4F0 0%, transparent 40%),
  radial-gradient(circle at 0% 100%, #F8F4F0 0%, transparent 50%),
  radial-gradient(circle at 50% 100%, #F8F4F0 0%, transparent 50%)
`
/** Base color behind the gradients. */
const WALKTHROUGH_BASE = '#E0DBD7'

const meta = {
  title: 'Web/Screens/WalkthroughBackground',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj

/** Full-screen gradient background preview. */
export const Default: Story = {
  render: () => (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: WALKTHROUGH_BASE,
        backgroundImage: WALKTHROUGH_BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 300,
          height: 400,
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          borderRadius: 8,
        }}
      />
    </div>
  ),
}

/** Phone aspect ratio (600x600 Lottie placeholder centered). */
export const WithLottiePlaceholder: Story = {
  render: () => (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: WALKTHROUGH_BASE,
        backgroundImage: WALKTHROUGH_BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 300,
          height: 300,
          border: '2px dashed #98908B',
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#98908B',
          fontFamily: 'sans-serif',
          fontSize: 14,
        }}
      >
        600x600 Lottie
      </div>
    </div>
  ),
}
