<script setup lang="ts">
const props = defineProps<{ src?: string, title: string }>()
const loaded = ref(false)
const failed = ref(false)
const image = ref<HTMLImageElement | null>(null)
const { t } = useI18n()
onMounted(() => {
  if (!image.value?.complete) return
  loaded.value = image.value.naturalWidth > 0
  failed.value = !loaded.value
})
watch(() => props.src, () => {
  loaded.value = false
  failed.value = false
})
</script>

<template>
  <div class="relative aspect-4/3 overflow-hidden rounded-lg bg-rose-quartz">
    <div
      v-if="!loaded"
      role="img"
      :aria-label="t('products.homeImageFallback', { title })"
      class="absolute inset-0 flex items-center justify-center text-forest"
    >
      <UIcon
        name="i-lucide-package"
        class="size-8"
        aria-hidden="true"
      />
    </div>
    <img
      v-if="src && !failed"
      ref="image"
      :key="src"
      :src="src"
      :alt="title"
      width="640"
      height="480"
      class="size-full object-cover object-center"
      :class="loaded ? 'visible' : 'invisible'"
      @load="loaded = true"
      @error="failed = true; loaded = false"
    >
  </div>
</template>
