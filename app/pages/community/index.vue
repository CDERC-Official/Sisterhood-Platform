<script setup lang="ts">
import { communityTags } from '#shared/types'
import type { CommunityTag } from '#shared/types'
import { redirectToAuth } from '~/utils/auth-redirect'
import {
  communityReturnPath,
  communityTagSlug,
  filterCommunityPostsByTag,
  hasCommunityPostFormErrors,
  parseCommunityTagQuery,
  validateCommunityPostForm,
  type CommunityPostFormErrors,
  type CommunityTagFilter
} from '~/utils/community'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const { user } = useAuth()
const { state } = useMockStore()
const { posts, createPost, appendReply, deleteOwnPost, deleteOwnReply } = useCommunity()

useHead({
  title: () => t('community.title')
})

const selectedTag = computed(() => parseCommunityTagQuery(route.query.tag))

const filteredPosts = computed(() =>
  filterCommunityPostsByTag(posts.value, selectedTag.value)
)

const draftTag = ref<CommunityTag | undefined>(undefined)
const draftTitle = ref('')
const draftBody = ref('')
const formErrors = ref<CommunityPostFormErrors>({})
const publishing = ref(false)

const tagItems = computed(() =>
  communityTags.map(tag => ({
    label: tagLabel(tag),
    value: tag
  }))
)

function tagLabel(tag: CommunityTag) {
  return t(`community.tag.${tag}`)
}

function selectTag(tag: CommunityTagFilter) {
  const query = tag === 'all'
    ? {}
    : { tag: communityTagSlug(tag) }

  return router.push({
    path: route.path,
    query
  })
}

function requireAuth() {
  if (user.value) return false
  redirectToAuth(communityReturnPath(selectedTag.value))
  return true
}

function clearForm() {
  draftTag.value = undefined
  draftTitle.value = ''
  draftBody.value = ''
  formErrors.value = {}
}

function publishPost() {
  if (requireAuth()) return

  const errors = validateCommunityPostForm({
    tag: draftTag.value ?? '',
    title: draftTitle.value,
    body: draftBody.value
  })
  formErrors.value = errors
  if (hasCommunityPostFormErrors(errors) || !user.value || !draftTag.value || publishing.value) {
    return
  }

  publishing.value = true
  const created = createPost({
    authorUserId: user.value.id,
    tag: draftTag.value,
    title: draftTitle.value,
    body: draftBody.value
  })
  publishing.value = false

  if (!created) {
    formErrors.value = validateCommunityPostForm({
      tag: draftTag.value ?? '',
      title: draftTitle.value,
      body: draftBody.value
    })
    return
  }

  clearForm()
}

function fieldError(key: keyof CommunityPostFormErrors) {
  const code = formErrors.value[key]
  return code ? t(`community.errors.${key}`) : undefined
}

function onReply(postId: string, body: string) {
  if (!user.value) return
  appendReply(postId, {
    authorUserId: user.value.id,
    body
  })
}

function onDeletePost(postId: string) {
  if (!user.value) return
  deleteOwnPost(postId, user.value.id)
}

function onDeleteReply(postId: string, replyId: string) {
  if (!user.value) return
  deleteOwnReply(postId, replyId, user.value.id)
}
</script>

<template>
  <UContainer>
    <div class="mx-auto flex w-full max-w-3xl flex-col gap-8 py-16">
      <header class="flex flex-col gap-2">
        <h1 class="text-2xl font-semibold text-highlighted">
          {{ t('community.title') }}
        </h1>
        <p class="text-muted">
          {{ t('community.lead') }}
        </p>
      </header>

      <UCard :ui="{ body: 'flex flex-col gap-4' }">
        <div class="flex flex-col gap-1">
          <h2 class="text-lg font-semibold text-highlighted">
            {{ t('community.composeTitle') }}
          </h2>
          <p class="text-sm text-muted">
            {{ t('community.composeLead') }}
          </p>
        </div>

        <form
          class="flex flex-col gap-4"
          @focusin="requireAuth"
          @submit.prevent="publishPost"
        >
          <UFormField
            :label="t('community.fields.tag')"
            name="tag"
            required
            :error="fieldError('tag')"
          >
            <USelect
              v-model="draftTag"
              :items="tagItems"
              :placeholder="t('community.fields.tagPlaceholder')"
              class="w-full"
              @update:model-value="formErrors = { ...formErrors, tag: undefined }"
            />
          </UFormField>

          <UFormField
            :label="t('community.fields.title')"
            name="title"
            required
            :error="fieldError('title')"
          >
            <UInput
              v-model="draftTitle"
              :placeholder="t('community.fields.titlePlaceholder')"
              class="w-full"
              @update:model-value="formErrors = { ...formErrors, title: undefined }"
            />
          </UFormField>

          <UFormField
            :label="t('community.fields.body')"
            name="body"
            required
            :error="fieldError('body')"
          >
            <UTextarea
              v-model="draftBody"
              :placeholder="t('community.fields.bodyPlaceholder')"
              :rows="4"
              autoresize
              class="w-full"
              @update:model-value="formErrors = { ...formErrors, body: undefined }"
            />
          </UFormField>

          <div>
            <UButton
              type="submit"
              color="primary"
              :label="t('community.publish')"
              :loading="publishing"
            />
          </div>
        </form>
      </UCard>

      <div
        class="flex flex-wrap gap-2"
        role="group"
        :aria-label="t('community.filters')"
      >
        <UButton
          :label="t('community.all')"
          size="sm"
          :variant="selectedTag === 'all' ? 'solid' : 'outline'"
          :color="selectedTag === 'all' ? 'primary' : 'neutral'"
          @click="selectTag('all')"
        />
        <UButton
          v-for="tag in communityTags"
          :key="tag"
          :label="tagLabel(tag)"
          size="sm"
          :variant="selectedTag === tag ? 'solid' : 'outline'"
          :color="selectedTag === tag ? 'primary' : 'neutral'"
          @click="selectTag(tag)"
        />
      </div>

      <UEmpty
        v-if="filteredPosts.length === 0"
        :title="t('empty.title')"
        :description="t('community.empty')"
      />

      <div
        v-else
        class="flex flex-col gap-6"
      >
        <CommunityPostCard
          v-for="post in filteredPosts"
          :key="post.id"
          :post="post"
          :users="state.users"
          :current-user-id="user?.id ?? null"
          :locale-code="locale"
          @reply="(body) => onReply(post.id, body)"
          @delete-post="onDeletePost(post.id)"
          @delete-reply="(replyId) => onDeleteReply(post.id, replyId)"
          @require-auth="requireAuth"
        />
      </div>
    </div>
  </UContainer>
</template>
