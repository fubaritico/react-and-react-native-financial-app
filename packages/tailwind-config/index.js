const tokens = require('@financial-app/tokens/tailwind')

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    colors: tokens.color,
    borderRadius: tokens.radius,
    spacing: tokens.spacing,
    fontFamily: {
      sans: tokens.font['family-sans'].split(', '),
    },
    fontSize: {
      xs: tokens.font['size-xs'],
      sm: tokens.font['size-sm'],
      base: tokens.font['size-base'],
      lg: tokens.font['size-lg'],
      xl: tokens.font['size-xl'],
      '2xl': tokens.font['size-2xl'],
      '3xl': tokens.font['size-3xl'],
      '4xl': tokens.font['size-4xl'],
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
