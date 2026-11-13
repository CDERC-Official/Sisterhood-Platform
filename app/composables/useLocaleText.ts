import type { LocaleString } from '#shared/types'

/**
 * UI chrome uses `t()`. Seed fields (`LocaleString`) use `localeText()`.
 *
 * const { localeText } = useLocaleText()
 * localeText(product.title)
 */
export function useLocaleText() {
  const { locale } = useI18n()

  function localeText(value: LocaleString) {
    return resolveLocaleString(value, locale.value)
  }

  return { localeText }
}
