import { describe, expect, it } from 'vitest'
import { isSafeReturnTo, resolveReturnTo } from './auth-redirect'

describe('isSafeReturnTo', () => {
  it('accepts same-site relative paths', () => {
    expect(isSafeReturnTo('/account')).toBe(true)
    expect(isSafeReturnTo('/de/account/studio')).toBe(true)
    expect(isSafeReturnTo('/products/bowl-1')).toBe(true)
    expect(isSafeReturnTo('/community?tag=materials')).toBe(true)
  })

  it('rejects empty, absolute, and protocol-relative values', () => {
    expect(isSafeReturnTo('')).toBe(false)
    expect(isSafeReturnTo('account')).toBe(false)
    expect(isSafeReturnTo('https://evil.example/phish')).toBe(false)
    expect(isSafeReturnTo('//evil.example/phish')).toBe(false)
    expect(isSafeReturnTo(undefined)).toBe(false)
    expect(isSafeReturnTo(['/account'])).toBe(false)
  })
})

describe('resolveReturnTo', () => {
  it('returns the path when safe and null otherwise', () => {
    expect(resolveReturnTo('/de/products/1')).toBe('/de/products/1')
    expect(resolveReturnTo('https://evil.example')).toBeNull()
    expect(resolveReturnTo(undefined)).toBeNull()
  })
})
