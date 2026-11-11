<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: () => t('account.nav.studio')
})
</script>

<template>
  <UEmpty :description="t('account.empty.studio')" />
</template>
