<script setup lang="ts">
import type { Inquiry, User } from '#shared/types'
import { displayNameFor, formatInquiryTime } from '~/utils/inquiries'

const props = defineProps<{
  inquiry: Inquiry
  users: User[]
  productTitle: string
  productTo?: string | null
  productMissing?: boolean
  backTo: string
  backLabel: string
  replyLabel: string
  replyPlaceholder: string
  replyRequired: string
  sendReplyLabel: string
  localeCode: string
}>()

const emit = defineEmits<{
  reply: [body: string]
}>()

const draft = ref('')
const error = ref('')
const sending = ref(false)

const orderedMessages = computed(() =>
  props.inquiry.messages
    .slice()
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
)

function authorName(userId: string) {
  return displayNameFor(props.users, userId)
}

function sendReply() {
  const body = draft.value.trim()
  if (!body) {
    error.value = props.replyRequired
    return
  }
  if (sending.value) return

  sending.value = true
  emit('reply', body)
  draft.value = ''
  error.value = ''
  sending.value = false
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-3">
      <UButton
        :to="backTo"
        variant="ghost"
        color="neutral"
        :label="backLabel"
        class="self-start"
      />

      <h1 class="text-2xl font-semibold text-highlighted">
        <NuxtLink
          v-if="productTo && !productMissing"
          :to="productTo"
          class="hover:underline"
        >
          {{ productTitle }}
        </NuxtLink>
        <span
          v-else
          class="text-muted"
        >
          {{ productTitle }}
        </span>
      </h1>
    </div>

    <div class="flex flex-col gap-4">
      <UCard
        v-for="message in orderedMessages"
        :key="message.id"
        :ui="{ body: 'flex flex-col gap-2' }"
      >
        <div class="flex flex-wrap items-baseline justify-between gap-2">
          <p class="text-sm font-medium text-highlighted">
            {{ authorName(message.authorUserId) }}
          </p>
          <time
            class="text-xs text-muted"
            :datetime="message.createdAt"
          >
            {{ formatInquiryTime(message.createdAt, localeCode) }}
          </time>
        </div>
        <p class="whitespace-pre-wrap text-default">
          {{ message.body }}
        </p>
      </UCard>
    </div>

    <div class="flex flex-col gap-3 border-t border-default pt-6">
      <UFormField
        :label="replyLabel"
        name="reply"
        :error="error || undefined"
      >
        <UTextarea
          v-model="draft"
          :placeholder="replyPlaceholder"
          :rows="4"
          autoresize
          @update:model-value="error = ''"
        />
      </UFormField>

      <UButton
        color="primary"
        class="self-start"
        :label="sendReplyLabel"
        :loading="sending"
        @click="sendReply"
      />
    </div>
  </div>
</template>
