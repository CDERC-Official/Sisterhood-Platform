<script setup lang="ts">
import {
  canViewInquiryAsMaker,
  findInquiryById,
  findProductForInquiry
} from '~/utils/inquiries'

const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { localeText } = useLocaleText()
const { user } = useAuth()
const { state } = useMockStore()
const { inquiries, appendInquiryMessage } = useInquiries()
const { products } = useProducts()

const inquiryId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? id : Array.isArray(id) ? id[0] ?? '' : ''
})

const inquiry = computed(() => {
  if (!user.value) return null
  const found = findInquiryById(inquiries.value, inquiryId.value)
  if (!found || !canViewInquiryAsMaker(found, user.value.id)) return null
  return found
})

const product = computed(() =>
  inquiry.value ? findProductForInquiry(products.value, inquiry.value) ?? null : null
)

const productTitle = computed(() => {
  if (!inquiry.value) return t('account.inbox.notFound')
  if (!product.value) return t('account.inbox.productUnavailable')
  return localeText(product.value.title)
})

useHead({
  title: () => productTitle.value
})

function onReply(body: string) {
  if (!user.value || !inquiry.value) return
  appendInquiryMessage(inquiry.value.id, {
    authorUserId: user.value.id,
    body
  })
}
</script>

<template>
  <div
    v-if="!inquiry"
    class="flex flex-col gap-6"
  >
    <UEmpty
      :title="t('account.inbox.notFound')"
      :description="t('account.inbox.notFoundDescription')"
    />
    <UButton
      :to="localePath('/account/inbox')"
      variant="outline"
      :label="t('account.inbox.back')"
      class="self-start"
    />
  </div>

  <InquiryThreadView
    v-else
    :inquiry="inquiry"
    :users="state.users"
    :product-title="productTitle"
    :product-to="product ? localePath(`/products/${product.id}`) : null"
    :product-missing="!product"
    :back-to="localePath('/account/inbox')"
    :back-label="t('account.inbox.back')"
    :reply-label="t('account.inbox.reply')"
    :reply-placeholder="t('account.inbox.replyPlaceholder')"
    :reply-required="t('account.inbox.replyRequired')"
    :send-reply-label="t('account.inbox.sendReply')"
    :locale-code="locale"
    @reply="onReply"
  />
</template>
