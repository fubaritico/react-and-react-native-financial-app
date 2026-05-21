declare module '*.png' {
  /** PNG image imported as a URL string (Vite) or a require source number (Metro) */
  const src: string
  export default src
}
