<script setup lang="ts">
import { layoutCopy } from '~/data/layout-copy'

const { locale } = useI18n()
const localePath = useLocalePath()
const copy = computed(() => layoutCopy[locale.value === 'de' ? 'de' : 'en'])
</script>

<template>
  <UFooter
    class="border-t border-default bg-sage"
    :ui="{ container: 'gap-4 py-6', left: 'text-center lg:text-left', right: 'text-center lg:text-right' }"
  >
    <template #top>
      <UContainer class="grid gap-8 py-12 md:grid-cols-2 md:gap-16">
        <div>
          <NuxtLink
            :to="localePath('/')"
            :aria-label="copy.home"
            class="inline-flex rounded-md p-1 -ms-1"
          >
            <AppLogo />
          </NuxtLink>

          <p class="mt-4 max-w-reading text-base leading-relaxed text-graphite">
            {{ copy.footerIntro }}
          </p>
        </div>

        <div class="md:justify-self-end">
          <h2 class="text-lg font-semibold text-forest">
            {{ copy.footerTitle }}
          </h2>
          <p class="mt-3 max-w-sm text-sm leading-relaxed text-graphite">
            {{ copy.footerText }}
          </p>
        </div>
      </UContainer>
    </template>

    <template #left>
      <p class="text-sm text-graphite">
        © {{ new Date().getFullYear() }} Sisterhood
      </p>
    </template>

    <template #right>
      <p class="text-sm text-graphite">
        {{ copy.demo }}
      </p>
    </template>
  </UFooter>
</template>
