declare module '*.svg' {
  import type { FC } from 'react'
  import type { SvgProps } from 'react-native-svg'

  /** SVG imported as a React Native component (via react-native-svg-transformer) */
  const component: FC<SvgProps>
  export default component
}

declare module '*.svg?react' {
  import type { FC, SVGProps } from 'react'

  /** SVG imported as a React component (via vite-plugin-svgr) */
  const component: FC<SVGProps<SVGSVGElement>>
  export default component
}
