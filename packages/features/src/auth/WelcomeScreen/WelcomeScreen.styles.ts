/** Web-only classes for WelcomeScreen */
export const web = {
  /** Full-screen background with illustration */
  background:
    'min-h-screen flex items-end justify-center bg-cover bg-center p-4 pb-12',
  /** Semi-transparent card overlay */
  card: 'w-full max-w-md rounded-xl bg-white/90 backdrop-blur-sm p-8',
  /** Centered heading wrapper */
  heading: 'text-center',
  /** Description paragraph spacing + alignment */
  description: 'mt-3 text-center',
  /** CTA button wrapper */
  ctaWrapper: 'mt-6',
} as const

/** Native-only classes for WelcomeScreen */
export const native = {
  /** Full-screen background aligned to bottom */
  background: 'flex-1 justify-end',
  /** Card wrapper with padding */
  cardWrapper: 'p-4 pb-12',
  /** Semi-transparent white card */
  card: 'bg-white/90',
  /** Description text spacing */
  descriptionWrapper: 'mt-3',
  /** CTA button spacing */
  ctaWrapper: 'mt-6',
  /** Skip link spacing + centering */
  skipWrapper: 'mt-3 items-center',
} as const
