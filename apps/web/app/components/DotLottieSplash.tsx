import { DotLottieReact } from '@lottiefiles/dotlottie-react'

/** DotLottie animation canvas size (px) */
const SPLASH_SIZE = 300

/**
 * Client-only splash animation — cannot render during SSR (requires Canvas/WebGL).
 * Lives in its own module so it can be code-split via `React.lazy` without defining
 * a component inside the dynamic-import factory (which creates a fresh component
 * identity on every resolve and defeats reconciliation).
 * @returns The DotLottie splash canvas, played once (no loop)
 */
export default function DotLottieSplash() {
  return (
    <DotLottieReact
      src="/splash-animation.lottie"
      autoplay
      loop={false}
      style={{ width: SPLASH_SIZE, height: SPLASH_SIZE }}
    />
  )
}
