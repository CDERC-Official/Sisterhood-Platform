<script setup lang="ts">
import type { ProductCategory } from '#shared/types'

const { t } = useI18n()
const localePath = useLocalePath()
const { localeText } = useLocaleText()
const { user } = useAuth()
const { products } = useProducts()

useHead({
  title: () => t('studio.title')
})

const myProducts = computed(() => {
  if (!user.value) return []
  return products.value
    .filter(product => product.makerId === user.value!.id)
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
})

const createAction = computed(() => [{
  label: t('studio.create'),
  to: localePath('/account/studio/products/new')
}])

function categoryLabel(category: ProductCategory) {
  return t(`products.category.${category}`)
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <header class="flex flex-wrap items-start justify-between gap-4">
      <div class="flex flex-col gap-2">
        <h1 class="text-2xl font-semibold text-highlighted">
          {{ t('studio.title') }}
        </h1>
        <p class="text-muted">
          {{ t('studio.lead') }}
        </p>
      </div>

      <UButton
        v-if="myProducts.length > 0"
        :to="localePath('/account/studio/products/new')"
        :label="t('studio.create')"
      />
    </header>

    <UEmpty
      v-if="myProducts.length === 0"
      :title="t('empty.title')"
      :description="t('studio.empty')"
      :actions="createAction"
    />

    <div
      v-else
      class="flex flex-col gap-4"
    >
      <UCard
        v-for="product in myProducts"
        :key="product.id"
        :ui="{ body: 'flex flex-col gap-4 sm:flex-row sm:items-center' }"
      >
        <div class="size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
          <img
            v-if="product.imageUrls[0]"
            :src="product.imageUrls[0]"
            :alt="localeText(product.title)"
            class="size-full object-cover"
            loading="lazy"
          >
        </div>

        <div class="flex min-w-0 flex-1 flex-col gap-2">
          <div class="flex flex-wrap items-center gap-2">
            <UBadge
              :label="categoryLabel(product.category)"
              color="neutral"
              variant="subtle"
            />
          </div>
          <h2 class="text-lg font-semibold text-highlighted">
            {{ localeText(product.title) }}
          </h2>
          <div class="flex flex-wrap gap-2">
            <UButton
              :to="localePath(`/account/studio/products/${product.id}`)"
              size="sm"
              variant="outline"
              :label="t('studio.edit')"
            />
            <UButton
              :to="localePath(`/products/${product.id}`)"
              size="sm"
              color="neutral"
              variant="ghost"
              :label="t('studio.view')"
            />
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
