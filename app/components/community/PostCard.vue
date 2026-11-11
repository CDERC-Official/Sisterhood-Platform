<script setup lang="ts">
import type { CommunityPost, CommunityTag, User } from '#shared/types'
import {
  canDeleteCommunityPost,
  canDeleteCommunityReply,
  formatCommunityTime,
  validateCommunityReplyForm
} from '~/utils/community'
import { displayNameFor } from '~/utils/inquiries'

const props = defineProps<{
  post: CommunityPost
  users: User[]
  currentUserId: string | null
  localeCode: string
}>()

const emit = defineEmits<{
  reply: [body: string]
  deletePost: []
  deleteReply: [replyId: string]
  requireAuth: []
}>()

const { t } = useI18n()

const replyBody = ref('')
const replyError = ref('')
const sending = ref(false)
const deletePostOpen = ref(false)
const deleteReplyId = ref<string | null>(null)

const canDeletePost = computed(() =>
  canDeleteCommunityPost(props.post, props.currentUserId)
)

function tagLabel(tag: CommunityTag) {
  return t(`community.tag.${tag}`)
}

function authorName(userId: string) {
  return displayNameFor(props.users, userId)
}

function formatTime(iso: string) {
  return formatCommunityTime(iso, props.localeCode)
}

function requireAuth() {
  if (props.currentUserId) return false
  emit('requireAuth')
  return true
}

function onReplyFocus() {
  requireAuth()
}

function sendReply() {
  if (requireAuth()) return

  const errors = validateCommunityReplyForm(replyBody.value)
  if (errors.body) {
    replyError.value = t('community.replyRequired')
    return
  }
  if (sending.value) return

  sending.value = true
  emit('reply', replyBody.value)
  sending.value = false
  replyBody.value = ''
  replyError.value = ''
}

function confirmDeletePost() {
  emit('deletePost')
  deletePostOpen.value = false
}

function confirmDeleteReply() {
  if (!deleteReplyId.value) return
  emit('deleteReply', deleteReplyId.value)
  deleteReplyId.value = null
}
</script>

<template>
  <article class="flex flex-col gap-4 border-b border-default pb-6 last:border-b-0 last:pb-0">
    <div class="flex flex-col gap-3">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="flex flex-wrap items-center gap-2">
          <UBadge
            :label="tagLabel(post.tag)"
            color="neutral"
            variant="subtle"
          />
          <p class="text-sm text-muted">
            {{ authorName(post.authorUserId) }}
            ·
            {{ formatTime(post.createdAt) }}
          </p>
        </div>

        <UModal
          v-if="canDeletePost"
          v-model:open="deletePostOpen"
          :title="t('community.deletePostTitle')"
          :description="t('community.deletePostDescription')"
        >
          <UButton
            color="error"
            variant="ghost"
            size="sm"
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
                :label="t('community.deletePostConfirm')"
                @click="confirmDeletePost"
              />
            </div>
          </template>
        </UModal>
      </div>

      <h2 class="text-lg font-semibold text-highlighted">
        {{ post.title }}
      </h2>
      <p class="whitespace-pre-wrap text-default">
        {{ post.body }}
      </p>
    </div>

    <div
      v-if="post.replies.length > 0"
      class="flex flex-col gap-3 border-s-2 border-default ps-4"
    >
      <p class="text-sm font-medium text-muted">
        {{ t('community.replies') }}
      </p>
      <div
        v-for="reply in post.replies"
        :key="reply.id"
        class="flex flex-col gap-1"
      >
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="text-sm text-muted">
            {{ authorName(reply.authorUserId) }}
            ·
            {{ formatTime(reply.createdAt) }}
          </p>

          <UModal
            v-if="canDeleteCommunityReply(reply, currentUserId)"
            :open="deleteReplyId === reply.id"
            :title="t('community.deleteReplyTitle')"
            :description="t('community.deleteReplyDescription')"
            @update:open="(open) => { deleteReplyId = open ? reply.id : null }"
          >
            <UButton
              color="error"
              variant="ghost"
              size="xs"
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
                  :label="t('community.deleteReplyConfirm')"
                  @click="confirmDeleteReply"
                />
              </div>
            </template>
          </UModal>
        </div>
        <p class="whitespace-pre-wrap text-default">
          {{ reply.body }}
        </p>
      </div>
    </div>

    <form
      class="flex flex-col gap-3"
      @focusin="onReplyFocus"
      @submit.prevent="sendReply"
    >
      <UFormField
        :label="t('community.reply')"
        :name="`reply-${post.id}`"
        :error="replyError || undefined"
      >
        <UTextarea
          v-model="replyBody"
          :placeholder="t('community.replyPlaceholder')"
          :rows="2"
          autoresize
          class="w-full"
          @update:model-value="replyError = ''"
        />
      </UFormField>
      <div>
        <UButton
          type="submit"
          size="sm"
          color="primary"
          variant="soft"
          :label="t('community.sendReply')"
          :loading="sending"
        />
      </div>
    </form>
  </article>
</template>
