<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { primaryNavigation } from '~/data/navigation'
import { layoutCopy } from '~/data/layout-copy'

const route = useRoute()
const localePath = useLocalePath()
const open = ref(false)
const { locale } = useI18n()
const copy = computed(() => layoutCopy[locale.value === 'de' ? 'de' : 'en'])

const items = computed<NavigationMenuItem[]>(() => primaryNavigation.map(item => ({
  label: `${copy.value.links[item.path as keyof typeof copy.value.links]}${item.available ? '' : ` (${copy.value.soon})`}`,
  to: item.available ? localePath(item.path) : undefined,
  disabled: !item.available,
  exact: item.path === '/',
  active: item.available && (item.path === '/'
    ? route.path === localePath('/')
    : route.path === localePath(item.path) || route.path.startsWith(`${localePath(item.path)}/`)),
  onSelect: () => { open.value = false }
})))
</script>

<template>
  <UHeader
    v-model:open="open"
    title="Sisterhood"
    :menu="{ title: copy.menuTitle, description: copy.menuDescription }"
    class="bg-porcelain/95"
    :ui="{ container: 'gap-3', left: 'flex-none gap-6', center: 'flex-1 justify-end', right: 'flex-none' }"
  >
    <template #left>
      <NuxtLink
        :to="localePath('/')"
        :aria-label="copy.home"
        class="rounded-md p-1 -ms-1"
      >
        <AppLogo />
      </NuxtLink>

      <p class="hidden text-sm whitespace-nowrap text-muted 2xl:block">
        {{ copy.tagline }}
      </p>
    </template>

    <UNavigationMenu
      :items="items"
      :aria-label="copy.navigation"
      class="hidden lg:flex"
    />

    <template #right>
      <AppLanguageSwitcher />
    </template>

    <template #toggle="{ open: menuOpen, toggle }">
      <UButton
        :icon="menuOpen ? 'i-lucide-x' : 'i-lucide-menu'"
        :aria-label="menuOpen ? copy.close : copy.open"
        :aria-expanded="menuOpen"
        color="neutral"
        variant="ghost"
        class="lg:hidden"
        @click="toggle"
      />
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        :aria-label="copy.navigation"
      />
      <p class="mt-6 text-sm leading-relaxed text-muted">
        {{ copy.unavailable }}
      </p>
    </template>
  </UHeader>
</template>
