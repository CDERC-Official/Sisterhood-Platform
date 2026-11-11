<script setup lang="ts">
/**
 * Route stub so catalog links resolve with the active locale.
 * S3.2 replaces this with the full product page.
 */
const { t } = useI18n()
const localePath = useLocalePath()

useHead({
  title: () => t('products.title')
})
</script>

<template>
  <UContainer>
    <div class="mx-auto flex w-full max-w-3xl flex-col gap-6 py-16">
      <UEmpty
        :title="t('empty.title')"
        :description="t('empty.description')"
      />
      <UButton
        :to="localePath('/products')"
        variant="outline"
        :label="t('products.title')"
      />
    </div>
  </UContainer>
</template>
