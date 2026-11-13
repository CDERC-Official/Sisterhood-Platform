/**
 * Optional site-wide HTTP Basic Auth (htaccess-style).
 * Active only when runtimeConfig.sitePassword is set (NUXT_SITE_PASSWORD).
 */
export default defineEventHandler((event) => {
  const { sitePassword, sitePasswordUser } = useRuntimeConfig(event)
  if (!sitePassword) return

  const header = getHeader(event, 'authorization')
  if (header?.startsWith('Basic ')) {
    const decoded = atob(header.slice(6))
    const separator = decoded.indexOf(':')
    if (separator !== -1) {
      const user = decoded.slice(0, separator)
      const password = decoded.slice(separator + 1)
      if (user === sitePasswordUser && password === sitePassword) return
    }
  }

  setHeader(event, 'WWW-Authenticate', 'Basic realm="Sisterhood Preview"')
  throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
})
