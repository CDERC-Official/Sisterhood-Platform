<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: () => t('account.nav.inbox')
})
</script>

<template>
  <UEmpty :description="t('account.empty.inbox')" />
</template>
