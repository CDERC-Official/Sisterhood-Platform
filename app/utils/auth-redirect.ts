/**
 * returnTo must be a same-site relative path (optionally with query/hash).
 * Absolute URLs, protocol-relative URLs, and other values are rejected.
 */
export function isSafeReturnTo(value: unknown): value is string {
  if (typeof value !== 'string' || !value.startsWith('/')) return false
  if (value.startsWith('//') || value.includes('://')) return false
  return true
}

/** Safe path from a query value, or null when absent/invalid. */
export function resolveReturnTo(value: unknown): string | null {
  return isSafeReturnTo(value) ? value : null
}

/** Send a guest to /auth, keeping the locale prefix and an optional returnTo. */
export function redirectToAuth(returnTo?: string) {
  const localePath = useLocalePath()
  return navigateTo({
    path: localePath('/auth'),
    query: isSafeReturnTo(returnTo) ? { returnTo } : undefined
  })
}

/** After join/login, go to returnTo when safe, otherwise to /account. */
export function navigateAfterAuth(returnTo?: unknown) {
  const localePath = useLocalePath()
  const target = resolveReturnTo(returnTo)
  return navigateTo(target ?? localePath('/account'))
}
