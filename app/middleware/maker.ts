/**
 * Restricts maker-only account sections (inbox, studio).
 * Supporters who open those URLs are sent back to /account.
 * Pair with auth middleware on the /account parent.
 */
export default defineNuxtRouteMiddleware(() => {
  if (import.meta.client) {
    useMockStore().ensureHydrated()
  }

  const { user } = useAuth()
  if (user.value?.isMaker) return

  const localePath = useLocalePath()
  return navigateTo(localePath('/account'))
})
