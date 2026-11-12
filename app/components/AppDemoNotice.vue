<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <aside
    :aria-label="t('prototype.label')"
    class="border-b border-default bg-sisterhood-50 py-3"
  >
    <UContainer>
      <p class="max-w-reading text-sm text-graphite">
        {{ t('prototype.notice') }}
      </p>
    </UContainer>
  </aside>
</template>
