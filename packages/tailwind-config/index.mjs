import tokens from '@financial-app/tokens/tailwind'

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    colors: {
      ...tokens.color,
      transparent: 'transparent',
      current: 'currentColor',
    },
    borderRadius: tokens.radius,
    spacing: tokens.spacing,
    fontFamily: {
      sans: tokens.font['family-sans'].split(', '),
    },
    fontSize: {
      '2xs': tokens.font['size-2xs'],
      xs: tokens.font['size-xs'],
      sm: tokens.font['size-sm'],
      base: tokens.font['size-base'],
      lg: tokens.font['size-lg'],
      xl: tokens.font['size-xl'],
      '2xl': tokens.font['size-2xl'],
      '3xl': tokens.font['size-3xl'],
      '4xl': tokens.font['size-4xl'],
      '5xl': tokens.font['size-5xl'],
    },
    fontWeight: {
      normal: tokens.font['weight-normal'],
      bold: tokens.font['weight-bold'],
    },
    lineHeight: {
      tight: tokens.font['lineHeight-tight'],
      normal: tokens.font['lineHeight-normal'],
    },
    extend: {
      maxWidth: {
        /** Modal panel width — 560px (Figma spec) */
        modal: '35rem',
      },
    },
    keyframes: {
      'slide-up': {
        from: { transform: 'translateY(100%)' },
        to: { transform: 'translateY(0)' },
      },
    },
    animation: {
      'slide-up': 'slide-up 250ms ease-out',
    },
  },
}
