<script setup lang="ts">
import type { Product, ProductCategory } from '#shared/types'

const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { localeText } = useLocaleText()
const { user } = useAuth()
const { products } = useProducts()
const { makers } = useMakers()
const { createInquiry } = useInquiries()

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

const isOwnProduct = computed(() =>
  !!user.value && !!product.value && user.value.id === product.value.makerId
)

const selectedImageIndex = ref(0)
const inquireOpen = ref(false)
const inquireMessage = ref('')
const inquireError = ref('')
const sending = ref(false)

watch(productId, () => {
  selectedImageIndex.value = 0
  inquireOpen.value = false
  inquireMessage.value = ''
  inquireError.value = ''
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

function onInquireClick() {
  if (!user.value) {
    return redirectToAuth(route.fullPath)
  }
  if (isOwnProduct.value) return
  inquireError.value = ''
  inquireOpen.value = true
}

function sendInquiry() {
  const body = inquireMessage.value.trim()
  if (!body) {
    inquireError.value = t('products.inquireRequired')
    return
  }
  if (!user.value || !product.value || isOwnProduct.value || sending.value) return

  sending.value = true
  const inquiry = createInquiry({
    productId: product.value.id,
    makerUserId: product.value.makerId,
    inquirerUserId: user.value.id,
    body
  })
  sending.value = false

  if (!inquiry) {
    inquireError.value = t('products.inquireRequired')
    return
  }

  inquireOpen.value = false
  inquireMessage.value = ''
  inquireError.value = ''
  return navigateTo(localePath(`/account/inquiries/${inquiry.id}`))
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

        <div class="flex flex-col gap-2">
          <template v-if="isOwnProduct">
            <UButton
              color="primary"
              :label="t('products.inquire')"
              disabled
            />
            <p class="text-sm text-muted">
              {{ t('products.inquireOwn') }}
            </p>
          </template>

          <UButton
            v-else
            color="primary"
            :label="t('products.inquire')"
            @click="onInquireClick"
          />
        </div>
      </div>
    </div>

    <UModal
      v-model:open="inquireOpen"
      :title="t('products.inquireTitle')"
      :description="t('products.inquireDescription')"
    >
      <template #body>
        <div class="flex flex-col gap-3">
          <UFormField
            :label="t('products.inquireMessage')"
            name="inquireMessage"
            required
            :error="inquireError || undefined"
          >
            <UTextarea
              v-model="inquireMessage"
              :placeholder="t('products.inquireMessagePlaceholder')"
              :rows="4"
              autoresize
              @update:model-value="inquireError = ''"
            />
          </UFormField>
        </div>
      </template>

      <template #footer="{ close }">
        <div class="flex flex-wrap justify-end gap-2">
          <UButton
            color="neutral"
            variant="outline"
            :label="t('actions.cancel')"
            @click="close()"
          />
          <UButton
            color="primary"
            :label="t('products.inquireSend')"
            :loading="sending"
            @click="sendInquiry"
          />
        </div>
      </template>
    </UModal>
  </UContainer>
</template>
