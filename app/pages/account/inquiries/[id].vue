<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: () => t('account.nav.inquiries')
})
</script>

<template>
  <UEmpty :description="t('account.empty.inquiries')" />
</template>
