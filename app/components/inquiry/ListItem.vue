<script setup lang="ts">
defineProps<{
  to: string
  productTitle: string
  productMissing?: boolean
  metaLabel: string
  metaName: string
  preview: string
  timeLabel: string
  openLabel: string
}>()
</script>

<template>
  <UCard :ui="{ body: 'flex flex-col gap-3' }">
    <div class="flex flex-col gap-1">
      <p
        class="text-base font-semibold text-highlighted"
        :class="productMissing ? 'text-muted' : undefined"
      >
        {{ productTitle }}
      </p>
      <p class="text-sm text-muted">
        <span class="font-medium text-default">{{ metaLabel }}:</span>
        {{ metaName }}
      </p>
    </div>

    <p class="line-clamp-2 text-sm text-default">
      {{ preview }}
    </p>

    <div class="flex flex-wrap items-center justify-between gap-3">
      <p class="text-xs text-muted">
        {{ timeLabel }}
      </p>
      <UButton
        :to="to"
        variant="outline"
        size="sm"
        :label="openLabel"
      />
    </div>
  </UCard>
</template>
