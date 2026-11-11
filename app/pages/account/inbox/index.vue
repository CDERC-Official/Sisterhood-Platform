<script setup lang="ts">
import {
  displayNameFor,
  formatInquiryTime,
  inquiriesForMakerInbox,
  lastInquiryMessage,
  messagePreview
} from '~/utils/inquiries'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const { localeText } = useLocaleText()
const { user } = useAuth()
const { state } = useMockStore()
const { inquiries } = useInquiries()
const { products } = useProducts()

useHead({
  title: () => t('account.inbox.title')
})

const rows = computed(() => {
  if (!user.value) return []

  return inquiriesForMakerInbox(inquiries.value, user.value.id).map((inquiry) => {
    const product = products.value.find(item => item.id === inquiry.productId) ?? null
    const last = lastInquiryMessage(inquiry)

    return {
      id: inquiry.id,
      to: localePath(`/account/inbox/${inquiry.id}`),
      productTitle: product
        ? localeText(product.title)
        : t('account.inbox.productUnavailable'),
      productMissing: !product,
      metaName: displayNameFor(state.value.users, inquiry.inquirerUserId),
      preview: messagePreview(last?.body ?? ''),
      timeLabel: formatInquiryTime(last?.createdAt ?? inquiry.createdAt, locale.value)
    }
  })
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <header class="flex flex-col gap-2">
      <h1 class="text-2xl font-semibold text-highlighted">
        {{ t('account.inbox.title') }}
      </h1>
      <p class="text-muted">
        {{ t('account.inbox.lead') }}
      </p>
    </header>

    <UEmpty
      v-if="rows.length === 0"
      :title="t('account.inbox.emptyTitle')"
      :description="t('account.inbox.empty')"
    />

    <div
      v-else
      class="flex flex-col gap-4"
    >
      <InquiryListItem
        v-for="row in rows"
        :key="row.id"
        :to="row.to"
        :product-title="row.productTitle"
        :product-missing="row.productMissing"
        :meta-label="t('account.inbox.inquirer')"
        :meta-name="row.metaName"
        :preview="row.preview"
        :time-label="row.timeLabel"
        :open-label="t('account.inbox.open')"
      />
    </div>
  </div>
</template>
