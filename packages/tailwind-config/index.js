const tokens = require('@financial-app/tokens/tailwind')

/** @type {import('tailwindcss').Config} */
module.exports = {
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
  },
}
