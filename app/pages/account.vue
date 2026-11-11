<script setup lang="ts">
/**
 * Parent for /account and nested account routes.
 * Auth middleware here runs for every matched child under this segment.
 */
definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <NuxtPage />
</template>
