<script setup lang="ts">
defineProps<{ name: string, place: string, bio: string, action: string, imageLabel: string }>()
defineEmits<{ preview: [] }>()
</script>

<template>
  <article class="flex h-full flex-col">
    <HomeImagePlaceholder
      :initials="name.split(' ').map(part => part[0]).join('')"
      :label="imageLabel"
      class="aspect-4/3"
    />
    <div class="flex flex-1 flex-col pt-5">
      <h3 class="text-xl font-semibold text-forest">
        {{ name }}
      </h3>
      <p class="mt-1 flex items-center gap-2 text-sm text-muted">
        <UIcon
          name="i-lucide-map-pin"
          class="size-4 shrink-0"
          aria-hidden="true"
        />
        {{ place }}
      </p>
      <p class="mt-4 line-clamp-3 text-base leading-relaxed text-graphite">
        {{ bio }}
      </p>
      <div class="mt-auto pt-5">
        <UButton
          :label="action"
          variant="outline"
          @click="$emit('preview')"
        />
      </div>
    </div>
  </article>
</template>
