import type { LocaleCode, LocaleString } from '#shared/types'

const localeCodes: readonly LocaleCode[] = ['en', 'de']

export function isLocaleCode(value: string): value is LocaleCode {
  return localeCodes.includes(value as LocaleCode)
}

/**
 * Picks the seed-field copy for a locale.
 * Unknown locales fall back to English, which is the default locale.
 */
export function resolveLocaleString(value: LocaleString, locale: string): string {
  if (isLocaleCode(locale)) return value[locale]
  return value.en
}
