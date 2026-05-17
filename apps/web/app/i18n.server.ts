import { i18nConfig } from '@financial-app/shared/i18n'

const SUPPORTED_LOCALES = i18nConfig.supportedLngs as string[]
const FALLBACK = (i18nConfig.fallbackLng as string | undefined) ?? 'en'

/**
 * Parses the Accept-Language header and returns the first supported locale.
 * Falls back to 'en' if no match found.
 *
 * @example resolveLocale(request) // "fr"
 */
export function resolveLocale(request: Request): string {
  const header = request.headers.get('Accept-Language') ?? ''

  // Parse "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7" → ['fr', 'fr', 'en', 'en']
  const candidates = header
    .split(',')
    .map((part) => part.split(';')[0].trim().split('-')[0])

  return candidates.find((l) => SUPPORTED_LOCALES.includes(l)) ?? FALLBACK
}
