<script setup lang="ts">
import {
  currencies,
  productCategories
} from '#shared/types'
import type {
  Currency,
  LocaleCode,
  Price,
  Product,
  ProductCategory
} from '#shared/types'

export type ProductFormValues = {
  title: { en: string, de: string }
  description: { en: string, de: string }
  category: ProductCategory
  price?: Price
  imageUrls: string[]
}

type FieldError = {
  name: string
  message: string
}

type FormState = {
  titleEn: string
  titleDe: string
  descriptionEn: string
  descriptionDe: string
  category: ProductCategory | undefined
  // UInput type="number" can bind a number at runtime
  amount: string | number
  currency: Currency | undefined
  imageUrls: string[]
}

const props = defineProps<{
  product?: Product | null
}>()

const emit = defineEmits<{
  submit: [values: ProductFormValues]
}>()

const { t, locale } = useI18n()

const textLocale = ref<LocaleCode>('en')
const state = reactive<FormState>(emptyState())

function emptyState(): FormState {
  return {
    titleEn: '',
    titleDe: '',
    descriptionEn: '',
    descriptionDe: '',
    category: undefined,
    amount: '',
    currency: undefined,
    imageUrls: ['']
  }
}

function syncFromProduct(product: Product | null | undefined) {
  if (!product) {
    Object.assign(state, emptyState())
    return
  }

  state.titleEn = product.title.en
  state.titleDe = product.title.de
  state.descriptionEn = product.description.en
  state.descriptionDe = product.description.de
  state.category = product.category
  state.amount = product.price ? String(product.price.amount) : ''
  state.currency = product.price?.currency
  state.imageUrls = product.imageUrls.length > 0 ? [...product.imageUrls] : ['']
}

watch(
  () => props.product,
  (product) => {
    syncFromProduct(product)
  },
  { immediate: true }
)

watch(locale, (value) => {
  if (value === 'en' || value === 'de') {
    textLocale.value = value
  }
}, { immediate: true })

watch(
  () => state.amount,
  (amount) => {
    if (!String(amount ?? '').trim()) {
      state.currency = undefined
    }
  }
)

const textTabs = computed(() => [
  { label: t('studio.fields.english'), value: 'en', slot: 'en' },
  { label: t('studio.fields.german'), value: 'de', slot: 'de' }
])

const categoryItems = computed(() =>
  productCategories.map(category => ({
    label: t(`products.category.${category}`),
    value: category
  }))
)

const currencyItems = computed(() =>
  currencies.map(currency => ({
    label: currency,
    value: currency
  }))
)

function isHttpUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function addImageUrl() {
  state.imageUrls.push('')
}

function removeImageUrl(index: number) {
  if (state.imageUrls.length <= 1) {
    state.imageUrls[0] = ''
    return
  }
  state.imageUrls.splice(index, 1)
}

function validateForm(form: Partial<FormState>): FieldError[] {
  const errors: FieldError[] = []
  const activeLocale = locale.value === 'de' ? 'de' : 'en'
  const activeTitle = activeLocale === 'de'
    ? form.titleDe?.trim() ?? ''
    : form.titleEn?.trim() ?? ''

  if (!activeTitle) {
    errors.push({
      name: activeLocale === 'de' ? 'titleDe' : 'titleEn',
      message: t('studio.errors.title')
    })
  }

  if (!form.category) {
    errors.push({ name: 'category', message: t('studio.errors.category') })
  }

  const imageUrls = (form.imageUrls ?? [])
    .map(url => url.trim())
    .filter(Boolean)

  if (imageUrls.length === 0) {
    errors.push({ name: 'imageUrls', message: t('studio.errors.images') })
  } else {
    const invalidIndex = (form.imageUrls ?? []).findIndex((url) => {
      const trimmed = url.trim()
      return trimmed !== '' && !isHttpUrl(trimmed)
    })
    if (invalidIndex >= 0) {
      errors.push({
        name: `imageUrls.${invalidIndex}`,
        message: t('studio.errors.imageUrl')
      })
    }
  }

  const amountRaw = String(form.amount ?? '').trim()
  const hasAmount = amountRaw !== ''
  const hasCurrency = Boolean(form.currency)

  if (hasAmount !== hasCurrency) {
    errors.push({
      name: hasAmount ? 'currency' : 'amount',
      message: t('studio.errors.priceIncomplete')
    })
  }

  if (hasAmount) {
    const amount = Number(amountRaw)
    if (!Number.isFinite(amount) || amount <= 0) {
      errors.push({ name: 'amount', message: t('studio.errors.amount') })
    }
  }

  return errors
}

function onSubmit() {
  const imageUrls = state.imageUrls
    .map(url => url.trim())
    .filter(Boolean)

  if (!state.category || imageUrls.length === 0) return

  const amountRaw = String(state.amount ?? '').trim()
  const values: ProductFormValues = {
    title: {
      en: state.titleEn.trim(),
      de: state.titleDe.trim()
    },
    description: {
      en: state.descriptionEn.trim(),
      de: state.descriptionDe.trim()
    },
    category: state.category,
    imageUrls
  }

  if (amountRaw && state.currency) {
    values.price = {
      amount: Number(amountRaw),
      currency: state.currency
    }
  }

  emit('submit', values)
}
</script>

<template>
  <UForm
    :state="state"
    :validate="validateForm"
    :loading-auto="false"
    novalidate
    class="flex flex-col gap-4"
    @submit="onSubmit"
  >
    <div class="flex flex-col gap-3">
      <p class="text-sm font-medium text-default">
        {{ t('studio.fields.title') }}
      </p>
      <UTabs
        v-model="textLocale"
        :items="textTabs"
        :unmount-on-hide="false"
        class="w-full"
        :ui="{ content: 'pt-3' }"
      >
        <template #en>
          <div class="flex flex-col gap-4">
            <UFormField
              name="titleEn"
              :label="t('studio.fields.titleEn')"
              :required="locale === 'en'"
            >
              <UInput
                v-model="state.titleEn"
                class="w-full"
              />
            </UFormField>
            <UFormField
              name="descriptionEn"
              :label="t('studio.fields.descriptionEn')"
            >
              <UTextarea
                v-model="state.descriptionEn"
                :rows="4"
                class="w-full"
              />
            </UFormField>
          </div>
        </template>
        <template #de>
          <div class="flex flex-col gap-4">
            <UFormField
              name="titleDe"
              :label="t('studio.fields.titleDe')"
              :required="locale === 'de'"
            >
              <UInput
                v-model="state.titleDe"
                class="w-full"
              />
            </UFormField>
            <UFormField
              name="descriptionDe"
              :label="t('studio.fields.descriptionDe')"
            >
              <UTextarea
                v-model="state.descriptionDe"
                :rows="4"
                class="w-full"
              />
            </UFormField>
          </div>
        </template>
      </UTabs>
    </div>

    <UFormField
      name="category"
      :label="t('studio.fields.category')"
      required
    >
      <USelect
        v-model="state.category"
        :items="categoryItems"
        :placeholder="t('studio.fields.categoryPlaceholder')"
        class="w-full"
      />
    </UFormField>

    <div class="grid gap-4 sm:grid-cols-2">
      <UFormField
        name="amount"
        :label="t('studio.fields.amount')"
        :help="t('studio.fields.amountHelp')"
      >
        <UInput
          v-model="state.amount"
          type="number"
          inputmode="decimal"
          min="0"
          step="any"
          class="w-full"
        />
      </UFormField>

      <UFormField
        name="currency"
        :label="t('studio.fields.currency')"
      >
        <USelect
          v-model="state.currency"
          :items="currencyItems"
          :placeholder="t('studio.fields.currencyPlaceholder')"
          class="w-full"
        />
      </UFormField>
    </div>

    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between gap-3">
        <p class="text-sm font-medium text-default">
          {{ t('studio.fields.images') }}
        </p>
        <UButton
          type="button"
          color="neutral"
          variant="ghost"
          size="sm"
          :label="t('studio.fields.addImage')"
          @click="addImageUrl"
        />
      </div>

      <UFormField
        name="imageUrls"
        :help="t('studio.fields.imagesHelp')"
      >
        <div class="flex flex-col gap-4">
          <div
            v-for="(_url, index) in state.imageUrls"
            :key="index"
            class="flex flex-col gap-2"
          >
            <UFormField :name="`imageUrls.${index}`">
              <div class="flex items-start gap-3">
                <div class="size-14 shrink-0 overflow-hidden rounded-md bg-muted">
                  <img
                    v-if="state.imageUrls[index]?.trim() && isHttpUrl(state.imageUrls[index]!.trim())"
                    :src="state.imageUrls[index]!.trim()"
                    alt=""
                    class="size-full object-cover"
                  >
                </div>
                <UInput
                  v-model="state.imageUrls[index]"
                  type="url"
                  inputmode="url"
                  :placeholder="t('studio.fields.imageUrl')"
                  class="w-full"
                />
                <UButton
                  type="button"
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-trash-2"
                  :aria-label="t('studio.fields.removeImage')"
                  @click="removeImageUrl(index)"
                />
              </div>
            </UFormField>
          </div>
        </div>
      </UFormField>
    </div>

    <div class="flex flex-wrap gap-3 pt-2">
      <UButton type="submit">
        {{ t('actions.save') }}
      </UButton>
      <slot name="actions" />
    </div>
  </UForm>
</template>
