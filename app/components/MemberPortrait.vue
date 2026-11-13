<script setup lang="ts">
const props = defineProps<{ src?: string, name: string }>()
const failed = ref(false)
const image = ref<HTMLImageElement | null>(null)
const { t } = useI18n()
onMounted(() => {
  if (image.value?.complete && !image.value.naturalWidth) failed.value = true
})
watch(() => props.src, () => {
  failed.value = false
})
</script>

<template>
  <div class="aspect-square overflow-hidden rounded-lg bg-sage">
    <img
      v-if="src && !failed"
      ref="image"
      :src="src"
      :alt="t('members.portraitAlt', { name })"
      width="480"
      height="480"
      class="size-full object-cover object-center"
      @error="failed = true"
    >
    <div
      v-else
      role="img"
      :aria-label="t('members.portraitFallback', { name })"
      class="flex size-full items-center justify-center text-3xl font-medium text-forest"
    >
      <span aria-hidden="true">{{ name.split(' ').map(part => part[0]).join('') }}</span>
    </div>
  </div>
</template>
