<script setup lang="ts">
/**
 * Parent for /account and nested account routes.
 * Auth middleware here runs for every matched child under this segment.
 * Shared nav is visible on every account page; maker-only items are gated.
 */
import type { NavigationMenuItem } from '@nuxt/ui'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const localePath = useLocalePath()
const { t } = useI18n()
const { user } = useAuth()

type AccountNavEntry = {
  key: 'profile' | 'inquiries' | 'inbox' | 'studio'
  path: string
  exact?: boolean
  makersOnly?: boolean
}

const entries: AccountNavEntry[] = [
  { key: 'profile', path: '/account', exact: true },
  { key: 'inquiries', path: '/account/inquiries' },
  { key: 'inbox', path: '/account/inbox', makersOnly: true },
  { key: 'studio', path: '/account/studio', makersOnly: true }
]

const items = computed<NavigationMenuItem[]>(() => {
  const isMaker = user.value?.isMaker === true

  return entries
    .filter(entry => !entry.makersOnly || isMaker)
    .map((entry) => {
      const path = localePath(entry.path)
      const active = entry.exact
        ? route.path === path
        : route.path === path || route.path.startsWith(`${path}/`)

      return {
        label: t(`account.nav.${entry.key}`),
        to: path,
        exact: entry.exact === true,
        active
      }
    })
})
</script>

<template>
  <UContainer>
    <div class="mx-auto flex w-full max-w-3xl flex-col gap-8 py-16">
      <UNavigationMenu
        :items="items"
        :aria-label="t('account.nav.label')"
        class="border-b border-default pb-2"
      />

      <NuxtPage />
    </div>
  </UContainer>
</template>
