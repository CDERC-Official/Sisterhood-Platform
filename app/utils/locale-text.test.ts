import { describe, expect, it } from 'vitest'
import de from '../../i18n/locales/de.json'
import en from '../../i18n/locales/en.json'
import { resolveLocaleString } from './locale-text'

const copy = { en: 'Bowl', de: 'Schale' }

describe('resolveLocaleString', () => {
  it('returns the string for the active locale', () => {
    expect(resolveLocaleString(copy, 'en')).toBe('Bowl')
    expect(resolveLocaleString(copy, 'de')).toBe('Schale')
  })

  it('falls back to English for an unknown locale', () => {
    expect(resolveLocaleString(copy, 'fr')).toBe('Bowl')
  })
})

describe('locale messages', () => {
  it('keeps the same keys in English and German', () => {
    expect(flatKeys(de)).toEqual(flatKeys(en))
  })
})

function flatKeys(value: unknown, prefix = ''): string[] {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    return Object.entries(value).flatMap(([key, child]) => {
      const path = prefix ? `${prefix}.${key}` : key
      return flatKeys(child, path)
    })
  }
  return [prefix]
}
