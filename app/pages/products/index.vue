<script setup lang="ts">
import { productCategories } from '#shared/types'
import type { Product, ProductCategory } from '#shared/types'

type CategoryFilter = ProductCategory | 'all'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const { localeText } = useLocaleText()
const { products } = useProducts()
const { makers } = useMakers()

useHead({
  title: () => t('products.title')
})

const search = ref('')
const selectedCategory = ref<CategoryFilter>('all')

const makerById = computed(() => {
  const map = new Map<string, { displayName: string, place: string }>()
  for (const maker of makers.value) {
    map.set(maker.user.id, {
      displayName: maker.user.displayName,
      place: maker.profile.place
    })
  }
  return map
})

const filteredProducts = computed(() => {
  const query = search.value.trim().toLocaleLowerCase(locale.value)

  return products.value.filter((product) => {
    if (selectedCategory.value !== 'all' && product.category !== selectedCategory.value) {
      return false
    }

    if (!query) return true

    const title = localeText(product.title).toLocaleLowerCase(locale.value)
    const makerName = (makerById.value.get(product.makerId)?.displayName ?? '')
      .toLocaleLowerCase(locale.value)

    return title.includes(query) || makerName.includes(query)
  })
})

function categoryLabel(category: ProductCategory) {
  return t(`products.category.${category}`)
}

function formatPrice(product: Product) {
  if (!product.price) return null

  return new Intl.NumberFormat(locale.value === 'de' ? 'de-AT' : 'en-GB', {
    style: 'currency',
    currency: product.price.currency,
    currencyDisplay: 'code'
  }).format(product.price.amount)
}

function selectCategory(category: CategoryFilter) {
  selectedCategory.value = category
}
</script>

<template>
  <UContainer>
    <div class="mx-auto flex w-full max-w-6xl flex-col gap-8 py-16">
      <header class="flex flex-col gap-2">
        <h1 class="text-2xl font-semibold text-highlighted">
          {{ t('products.title') }}
        </h1>
        <p class="text-muted">
          {{ t('products.lead') }}
        </p>
      </header>

      <div class="flex flex-col gap-4">
        <UFormField
          name="search"
          :label="t('products.search')"
        >
          <UInput
            v-model="search"
            type="search"
            :placeholder="t('products.searchPlaceholder')"
            icon="i-lucide-search"
            class="w-full max-w-md"
          />
        </UFormField>

        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-default">
            {{ t('products.categories') }}
          </p>
          <div
            class="flex flex-wrap gap-2"
            role="group"
            :aria-label="t('products.categories')"
          >
            <UButton
              :label="t('products.all')"
              size="sm"
              :variant="selectedCategory === 'all' ? 'solid' : 'outline'"
              :color="selectedCategory === 'all' ? 'primary' : 'neutral'"
              @click="selectCategory('all')"
            />
            <UButton
              v-for="category in productCategories"
              :key="category"
              :label="categoryLabel(category)"
              size="sm"
              :variant="selectedCategory === category ? 'solid' : 'outline'"
              :color="selectedCategory === category ? 'primary' : 'neutral'"
              @click="selectCategory(category)"
            />
          </div>
        </div>
      </div>

      <UEmpty
        v-if="filteredProducts.length === 0"
        :title="t('empty.title')"
        :description="t('products.empty')"
      />

      <div
        v-else
        class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <NuxtLink
          v-for="product in filteredProducts"
          :key="product.id"
          :to="localePath(`/products/${product.id}`)"
          class="block h-full rounded-card focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-forest"
        >
          <UCard
            class="h-full transition-colors hover:bg-muted/40"
            :ui="{ body: 'flex h-full flex-col gap-3' }"
          >
            <div class="aspect-4/3 overflow-hidden rounded-lg bg-muted">
              <img
                v-if="product.imageUrls[0]"
                :src="product.imageUrls[0]"
                :alt="localeText(product.title)"
                class="size-full object-cover"
                loading="lazy"
              >
            </div>

            <div class="flex flex-1 flex-col gap-2">
              <div class="flex flex-wrap items-center gap-2">
                <UBadge
                  :label="categoryLabel(product.category)"
                  color="neutral"
                  variant="subtle"
                />
                <p
                  v-if="product.price"
                  class="text-sm font-medium text-highlighted"
                >
                  {{ formatPrice(product) }}
                </p>
              </div>

              <h2 class="text-lg font-semibold text-highlighted">
                {{ localeText(product.title) }}
              </h2>

              <p class="text-sm text-muted">
                {{ makerById.get(product.makerId)?.displayName }}
              </p>
              <p class="text-sm text-muted">
                {{ makerById.get(product.makerId)?.place }}
              </p>
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </div>
  </UContainer>
</template>
