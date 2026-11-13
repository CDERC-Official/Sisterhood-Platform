<script setup lang="ts">
/**
 * Parent for /account/inbox and /account/inbox/[id].
 * Makers only; supporters are redirected to /account.
 */
definePageMeta({
  middleware: 'maker'
})
</script>

<template>
  <NuxtPage />
</template>
