/**
 * Protects /account (and nested account routes that opt into this middleware).
 * Session matches useAuth: the mock store's currentUserId after client hydration.
 *
 * SSR has no localStorage session, so guests (and refreshes) go to /auth with
 * returnTo. A signed-in browser then hydrates on /auth and navigateAfterAuth
 * sends them back.
 */
export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.client) {
    useMockStore().ensureHydrated()
  }

  const { user } = useAuth()
  if (user.value) return

  const localePath = useLocalePath()
  return navigateTo({
    path: localePath('/auth'),
    query: { returnTo: to.fullPath }
  })
})
