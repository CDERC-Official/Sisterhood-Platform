<script setup lang="ts">
import type { Product, ProductCategory } from '#shared/types'

const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { localeText } = useLocaleText()
const { products } = useProducts()
const { makers } = useMakers()

const productId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? id : Array.isArray(id) ? id[0] ?? '' : ''
})

const product = computed(() =>
  products.value.find(item => item.id === productId.value) ?? null
)

const maker = computed(() => {
  if (!product.value) return null
  return makers.value.find(item => item.user.id === product.value!.makerId) ?? null
})

const selectedImageIndex = ref(0)

watch(productId, () => {
  selectedImageIndex.value = 0
})

watch(
  () => product.value?.imageUrls.length ?? 0,
  (length) => {
    if (selectedImageIndex.value >= length) {
      selectedImageIndex.value = Math.max(0, length - 1)
    }
  }
)

const selectedImageUrl = computed(() =>
  product.value?.imageUrls[selectedImageIndex.value]
  ?? product.value?.imageUrls[0]
  ?? null
)

const title = computed(() =>
  product.value ? localeText(product.value.title) : t('products.notFound')
)

useHead({
  title: () => title.value
})

function categoryLabel(category: ProductCategory) {
  return t(`products.category.${category}`)
}

function formatPrice(item: Product) {
  if (!item.price) return null

  return new Intl.NumberFormat(locale.value === 'de' ? 'de-AT' : 'en-GB', {
    style: 'currency',
    currency: item.price.currency,
    currencyDisplay: 'code'
  }).format(item.price.amount)
}

function selectImage(index: number) {
  selectedImageIndex.value = index
}
</script>

<template>
  <UContainer>
    <div
      v-if="!product"
      class="mx-auto flex w-full max-w-3xl flex-col gap-6 py-16"
    >
      <UEmpty
        :title="t('products.notFound')"
        :description="t('products.notFoundDescription')"
      />
      <UButton
        :to="localePath('/products')"
        variant="outline"
        :label="t('products.back')"
      />
    </div>

    <div
      v-else
      class="mx-auto grid w-full max-w-6xl gap-10 py-16 lg:grid-cols-2 lg:items-start"
    >
      <div class="flex flex-col gap-4">
        <div class="aspect-4/3 overflow-hidden rounded-lg bg-muted">
          <img
            v-if="selectedImageUrl"
            :src="selectedImageUrl"
            :alt="localeText(product.title)"
            class="size-full object-cover"
          >
        </div>

        <div
          v-if="product.imageUrls.length > 1"
          class="flex flex-wrap gap-2"
          role="group"
          :aria-label="t('products.gallery')"
        >
          <button
            v-for="(url, index) in product.imageUrls"
            :key="`${url}-${index}`"
            type="button"
            class="size-16 overflow-hidden rounded-md bg-muted ring-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
            :class="index === selectedImageIndex ? 'ring-2 ring-forest' : 'ring-1 ring-default'"
            :aria-label="t('products.image', { n: index + 1 })"
            :aria-pressed="index === selectedImageIndex"
            @click="selectImage(index)"
          >
            <img
              :src="url"
              alt=""
              class="size-full object-cover"
              loading="lazy"
            >
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-3">
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

          <h1 class="text-3xl font-semibold text-highlighted">
            {{ localeText(product.title) }}
          </h1>

          <div
            v-if="maker"
            class="flex flex-col gap-1 text-sm text-muted"
          >
            <p>{{ maker.user.displayName }}</p>
            <p>{{ maker.profile.place }}</p>
          </div>
        </div>

        <p class="whitespace-pre-wrap text-default">
          {{ localeText(product.description) }}
        </p>

        <div>
          <UButton
            color="primary"
            :label="t('products.inquire')"
            disabled
          />
        </div>
      </div>
    </div>
  </UContainer>
</template>
