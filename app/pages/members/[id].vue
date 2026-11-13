<script setup lang="ts">
import { communityTagSlug, formatCommunityTime, sortCommunityPostsNewestFirst } from '~/utils/community'

const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { localeText } = useLocaleText()
const { members } = useMembers()
const { products } = useProducts()
const { posts } = useCommunity()
const member = computed(() => members.value.find(item => item.id === route.params.id))
const memberProducts = computed(() => products.value.filter(item => item.makerId === member.value?.id))
const memberPosts = computed(() => sortCommunityPostsNewestFirst(posts.value.filter(item => item.authorUserId === member.value?.id)))
usePublicSeo(
  () => member.value?.displayName ?? t('members.notFound'),
  () => t('seo.member', { name: member.value?.displayName ?? t('members.notFound') })
)
</script>

<template>
  <UContainer class="py-section">
    <UButton
      :to="localePath('/members')"
      :label="t('members.back')"
      icon="i-lucide-arrow-left"
      variant="link"
      class="mb-8"
    />
    <template v-if="member">
      <header class="grid gap-8 border-b border-default pb-10 md:grid-cols-[auto_1fr]">
        <MemberPortrait
          :src="member.portraitImageUrl"
          :name="member.displayName"
          class="w-40 sm:w-56"
        />
        <div class="min-w-0 max-w-reading">
          <h1 class="text-display font-semibold wrap-break-word text-forest">
            {{ member.displayName }}
          </h1>
          <p class="mt-3 text-muted">
            {{ member.place || t('members.noLocation') }}
          </p>
          <p class="mt-6 whitespace-pre-wrap text-lead wrap-break-word">
            {{ localeText(member.bio) || t('members.noBio') }}
          </p>
        </div>
      </header>
      <section
        class="py-10"
        aria-labelledby="member-products"
      >
        <h2
          id="member-products"
          class="mb-6 text-2xl font-semibold text-forest"
        >
          {{ t('members.products') }}
        </h2>
        <p
          v-if="!memberProducts.length"
          class="text-muted"
        >
          {{ t('members.noProducts') }}
        </p>
        <div
          v-else
          class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <article
            v-for="product in memberProducts"
            :key="product.id"
            class="rounded-card bg-sage/40 p-card"
          >
            <h3 class="text-xl font-semibold">
              {{ localeText(product.title) }}
            </h3>
            <p class="mt-3 line-clamp-3">
              {{ localeText(product.description) }}
            </p>
            <UButton
              :to="localePath(`/products/${product.id}`)"
              :label="t('members.viewProduct')"
              variant="outline"
              class="mt-5"
            />
          </article>
        </div>
      </section>
      <section
        class="border-t border-default py-10"
        aria-labelledby="member-posts"
      >
        <h2
          id="member-posts"
          class="mb-6 text-2xl font-semibold text-forest"
        >
          {{ t('members.posts') }}
        </h2>
        <p
          v-if="!memberPosts.length"
          class="text-muted"
        >
          {{ t('members.noPosts') }}
        </p>
        <div
          v-else
          class="max-w-reading space-y-8"
        >
          <article
            v-for="post in memberPosts"
            :key="post.id"
            class="border-b border-default pb-8"
          >
            <UBadge
              :label="t(`community.tag.${post.tag}`)"
              variant="subtle"
            />
            <time
              :datetime="post.createdAt"
              class="ms-3 text-sm text-muted"
            >{{ formatCommunityTime(post.createdAt, locale) }}</time>
            <h3 class="mt-4 text-xl font-semibold wrap-break-word">
              {{ post.title }}
            </h3>
            <p class="mt-3 whitespace-pre-wrap wrap-break-word">
              {{ post.body }}
            </p>
            <UButton
              :to="localePath({ path: '/community', query: { tag: communityTagSlug(post.tag) } })"
              :label="t('members.viewDiscussion')"
              variant="link"
              class="mt-4"
            />
          </article>
        </div>
      </section>
    </template>
    <UEmpty
      v-else
      :title="t('members.notFound')"
      :description="t('members.notFoundDescription')"
    />
  </UContainer>
</template>
