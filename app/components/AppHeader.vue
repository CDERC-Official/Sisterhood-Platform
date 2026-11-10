<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { primaryNavigation } from '~/data/navigation'

const route = useRoute()
const open = ref(false)

const items = computed<NavigationMenuItem[]>(() => primaryNavigation.map(item => ({
  label: item.available ? item.label : `${item.label} (bald)`,
  to: item.available ? item.path : undefined,
  disabled: !item.available,
  exact: item.path === '/',
  active: item.available && (item.path === '/'
    ? route.path === '/'
    : route.path === item.path || route.path.startsWith(`${item.path}/`)),
  onSelect: () => { open.value = false }
})))
</script>

<template>
  <UHeader
    v-model:open="open"
    title="Sisterhood"
    :menu="{ title: 'Navigation', description: 'Die Bereiche von Sisterhood' }"
    class="bg-porcelain/95"
    :ui="{ container: 'gap-3', left: 'flex-none gap-6', center: 'flex-1 justify-end', right: 'flex-none' }"
  >
    <template #left>
      <NuxtLink
        to="/"
        aria-label="Sisterhood – Startseite"
        class="rounded-md p-1 -ms-1"
      >
        <AppLogo />
      </NuxtLink>

      <p class="hidden text-sm whitespace-nowrap text-muted xl:block">
        Hier beginnt Verbindung.
      </p>
    </template>

    <UNavigationMenu
      :items="items"
      aria-label="Hauptnavigation"
      class="hidden lg:flex"
    />

    <template #toggle="{ open: menuOpen, toggle }">
      <UButton
        :icon="menuOpen ? 'i-lucide-x' : 'i-lucide-menu'"
        :aria-label="menuOpen ? 'Menü schließen' : 'Menü öffnen'"
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
        aria-label="Hauptnavigation"
      />
      <p class="mt-6 text-sm leading-relaxed text-muted">
        Die weiteren Bereiche entstehen gerade. Mit „bald“ gekennzeichnete
        Seiten sind noch nicht verfügbar.
      </p>
    </template>
  </UHeader>
</template>
