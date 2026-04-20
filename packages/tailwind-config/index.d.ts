interface TailwindConfig {
  theme: {
    colors: Record<string, string>
    borderRadius: Record<string, string>
    spacing: Record<string, string>
    fontFamily: Record<string, string[]>
    fontSize: Record<string, string>
    fontWeight: Record<string, string>
    lineHeight: Record<string, string>
  }
}

declare const config: TailwindConfig
export default config
