<script setup lang="ts">
defineProps<{ name: string, place: string, bio: string, action: string, imageSrc?: string, to: string }>()
</script>

<template>
  <article class="flex h-full flex-col">
    <NuxtLink :to="to">
      <MemberPortrait
        :src="imageSrc"
        :name="name"
      />
    </NuxtLink>
    <div class="flex flex-1 flex-col pt-5">
      <h3 class="text-xl font-semibold text-forest">
        <NuxtLink :to="to">{{ name }}</NuxtLink>
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
          :to="to"
        />
      </div>
    </div>
  </article>
</template>
