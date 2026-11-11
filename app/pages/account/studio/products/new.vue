<script setup lang="ts">
import type { ProductFormValues } from '~/components/studio/ProductForm.vue'

const { t } = useI18n()
const localePath = useLocalePath()
const { user } = useAuth()
const { createProduct } = useProducts()

useHead({
  title: () => t('studio.newTitle')
})

function onSubmit(values: ProductFormValues) {
  if (!user.value) return

  const product = createProduct({
    makerId: user.value.id,
    ...values
  })

  return navigateTo(localePath(`/products/${product.id}`))
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <header class="flex flex-col gap-2">
      <h1 class="text-2xl font-semibold text-highlighted">
        {{ t('studio.newTitle') }}
      </h1>
      <p class="text-muted">
        {{ t('studio.formLead') }}
      </p>
    </header>

    <StudioProductForm @submit="onSubmit">
      <template #actions>
        <UButton
          :to="localePath('/account/studio')"
          color="neutral"
          variant="outline"
          :label="t('actions.cancel')"
        />
      </template>
    </StudioProductForm>
  </div>
</template>
