import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '#shared': fileURLToPath(new URL('./shared', import.meta.url))
    }
  },
  define: {
    'import.meta.client': true,
    'import.meta.server': false
  },
  test: {
    environment: 'node',
    include: ['app/**/*.test.ts']
  }
})
