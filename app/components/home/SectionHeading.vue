<script setup lang="ts">
defineProps<{ title: string, description?: string }>()
</script>

<template>
  <div class="mb-10 max-w-reading">
    <h2 class="text-3xl leading-tight font-semibold tracking-tight text-forest sm:text-4xl">
      {{ title }}
    </h2>
    <p
      v-if="description"
      class="mt-5 text-lead text-muted"
    >
      {{ description }}
    </p>
  </div>
</template>
