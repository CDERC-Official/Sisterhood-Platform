<script setup lang="ts">
import type { ProductFormValues } from '~/components/studio/ProductForm.vue'

const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()
const { user } = useAuth()
const { products, updateProduct, deleteProduct } = useProducts()

const productId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? id : Array.isArray(id) ? id[0] ?? '' : ''
})

const product = computed(() => {
  if (!user.value) return null
  const found = products.value.find(item => item.id === productId.value) ?? null
  if (!found || found.makerId !== user.value.id) return null
  return found
})

const deleteOpen = ref(false)

useHead({
  title: () => product.value ? t('studio.editTitle') : t('studio.notFound')
})

function onSubmit(values: ProductFormValues) {
  if (!product.value) return

  updateProduct(product.value.id, {
    title: values.title,
    description: values.description,
    category: values.category,
    imageUrls: values.imageUrls,
    price: values.price
  })

  return navigateTo(localePath('/account/studio'))
}

function onDelete() {
  if (!product.value) return
  deleteProduct(product.value.id)
  deleteOpen.value = false
  return navigateTo(localePath('/account/studio'))
}
</script>

<template>
  <div
    v-if="!product"
    class="flex flex-col gap-6"
  >
    <UEmpty
      :title="t('studio.notFound')"
      :description="t('studio.notFoundDescription')"
    />
    <UButton
      :to="localePath('/account/studio')"
      variant="outline"
      :label="t('studio.back')"
      class="self-start"
    />
  </div>

  <div
    v-else
    class="flex flex-col gap-8"
  >
    <header class="flex flex-col gap-2">
      <h1 class="text-2xl font-semibold text-highlighted">
        {{ t('studio.editTitle') }}
      </h1>
      <p class="text-muted">
        {{ t('studio.formLead') }}
      </p>
    </header>

    <StudioProductForm
      :product="product"
      @submit="onSubmit"
    >
      <template #actions>
        <UButton
          :to="localePath('/account/studio')"
          color="neutral"
          variant="outline"
          :label="t('actions.cancel')"
        />
      </template>
    </StudioProductForm>

    <div class="border-t border-default pt-6">
      <UModal
        v-model:open="deleteOpen"
        :title="t('studio.deleteTitle')"
        :description="t('studio.deleteDescription')"
      >
        <UButton
          color="error"
          variant="outline"
          :label="t('actions.delete')"
        />

        <template #footer="{ close }">
          <div class="flex flex-wrap justify-end gap-2">
            <UButton
              color="neutral"
              variant="outline"
              :label="t('actions.cancel')"
              @click="close()"
            />
            <UButton
              color="error"
              :label="t('studio.deleteConfirm')"
              @click="onDelete"
            />
          </div>
        </template>
      </UModal>
    </div>
  </div>
</template>
