<script setup lang="ts">
withDefaults(defineProps<{ label: string, initials?: string, icon?: string, tone?: 'sage' | 'rose' | 'porcelain' }>(), { tone: 'sage' })
</script>

<template>
  <div
    class="relative flex min-h-48 items-center justify-center overflow-hidden rounded-card text-forest"
    :class="tone === 'rose' ? 'bg-rose-quartz' : tone === 'porcelain' ? 'bg-porcelain' : 'bg-sage'"
  >
    <span
      v-if="initials"
      class="font-sans text-6xl font-medium tracking-tight"
      aria-hidden="true"
    >{{ initials }}</span>
    <UIcon
      v-else
      :name="icon || 'i-lucide-image'"
      class="size-16"
      aria-hidden="true"
    />
    <span class="absolute inset-x-3 bottom-3 text-center text-xs">{{ label }}</span>
  </div>
</template>
