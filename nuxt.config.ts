// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/i18n'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  // The first prototype uses the approved light palette only.
  ui: {
    colorMode: false,
    // Font files are self-hosted and declared explicitly in main.css.
    fonts: false
  },

  // Site-wide preview gate (HTTP Basic Auth). Empty = off.
  // Set NUXT_SITE_PASSWORD (and optional NUXT_SITE_PASSWORD_USER) on Vercel.
  runtimeConfig: {
    sitePassword: '',
    sitePasswordUser: 'preview'
  },

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  // English stays unprefixed (`/products`). German is `/de/products`.
  // The URL is the locale. Browser detection stays off until a switcher exists.
  i18n: {
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    langDir: 'locales',
    locales: [
      { code: 'en', language: 'en', name: 'English', file: 'en.json' },
      { code: 'de', language: 'de', name: 'Deutsch', file: 'de.json' }
    ]
  }
})
