<script setup lang="ts">
import { communityTags } from '#shared/types'
import type { CommunityTag } from '#shared/types'
import { displayNameFor } from '~/utils/inquiries'
import {
  communityTagSlug,
  filterCommunityPostsByTag,
  formatCommunityTime,
  parseCommunityTagQuery,
  type CommunityTagFilter
} from '~/utils/community'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const { state } = useMockStore()
const { posts } = useCommunity()

useHead({
  title: () => t('community.title')
})

const selectedTag = computed(() => parseCommunityTagQuery(route.query.tag))

const filteredPosts = computed(() =>
  filterCommunityPostsByTag(posts.value, selectedTag.value)
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

function authorName(userId: string) {
  return displayNameFor(state.value.users, userId)
}

function formatTime(iso: string) {
  return formatCommunityTime(iso, locale.value)
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
        <article
          v-for="post in filteredPosts"
          :key="post.id"
          class="flex flex-col gap-4 border-b border-default pb-6 last:border-b-0 last:pb-0"
        >
          <div class="flex flex-col gap-3">
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
              <p class="text-sm text-muted">
                {{ authorName(reply.authorUserId) }}
                ·
                {{ formatTime(reply.createdAt) }}
              </p>
              <p class="whitespace-pre-wrap text-default">
                {{ reply.body }}
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </UContainer>
</template>
