<script setup lang="ts">
const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const languages = [
  { code: 'de', label: 'DE', name: 'Deutsch' },
  { code: 'en', label: 'EN', name: 'English' }
] as const
</script>

<template>
  <div
    role="group"
    :aria-label="locale === 'de' ? 'Sprache wählen' : 'Choose language'"
    class="flex shrink-0 items-center gap-1 rounded-lg border border-default p-1"
  >
    <UButton
      v-for="language in languages"
      :key="language.code"
      :to="switchLocalePath(language.code)"
      :locale="false"
      :lang="language.code"
      :hreflang="language.code"
      :aria-label="language.name"
      :aria-current="locale === language.code ? 'true' : undefined"
      :variant="locale === language.code ? 'solid' : 'ghost'"
      :label="language.label"
      size="xs"
    />
  </div>
</template>
