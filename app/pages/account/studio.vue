<script setup lang="ts">
/**
 * Parent for /account/studio (and later studio product forms).
 * Makers only; supporters are redirected to /account.
 */
definePageMeta({
  middleware: 'maker'
})
</script>

<template>
  <NuxtPage />
</template>
