<script setup lang="ts">
import { homeCopy } from '~/data/home-copy'
import type { CommunityPost, Product } from '#shared/types'

const { locale } = useI18n()
const { localeText } = useLocaleText()
const copy = computed(() => homeCopy[locale.value === 'de' ? 'de' : 'en'])
const { makers } = useMakers()
const { products } = useProducts()
const { posts } = useCommunity()
const { state } = useMockStore()

const featuredMaker = computed(() => makers.value.find(item => item.profile.place.startsWith('Graz')) || makers.value[0])
const featuredMembers = computed(() => {
  const first = featuredMaker.value
  return first ? [first, ...makers.value.filter(item => item.user.id !== first.user.id)].slice(0, 3) : []
})
const featuredPosts = computed(() => [...posts.value].sort((a, b) => Number(b.tag === 'Stories') - Number(a.tag === 'Stories')).slice(0, 3))
const featuredProducts = computed(() => featuredMembers.value
  .map(member => products.value.find(product => product.makerId === member.user.id))
  .filter((product): product is Product => Boolean(product)))
const previewOpen = ref(false)
const preview = ref({ title: '', subtitle: '', body: '', lang: '' })

useSeoMeta({
  title: () => `Sisterhood – ${copy.value.title}`,
  description: () => copy.value.intro,
  ogTitle: () => `Sisterhood – ${copy.value.title}`,
  ogDescription: () => copy.value.intro
})

function authorName(id: string) {
  return state.value.users.find(user => user.id === id)?.displayName || 'Sisterhood'
}

function showPreview(title: string, subtitle: string, body: string, lang = locale.value) {
  preview.value = { title, subtitle, body, lang }
  previewOpen.value = true
}

function showPost(post: CommunityPost) {
  showPreview(post.title, authorName(post.authorUserId), post.body, 'en')
}

function price(product: Product) {
  return product.price
    ? new Intl.NumberFormat(locale.value === 'de' ? 'de-AT' : 'en-GB', { style: 'currency', currency: product.price.currency, currencyDisplay: 'code' }).format(product.price.amount)
    : copy.value.noPrice
}
</script>

<template>
  <div>
    <HomeHero
      :copy="copy"
      :members="featuredMembers.map(member => ({ id: member.user.id, name: member.user.displayName, place: member.profile.place }))"
      :products="featuredProducts.map(product => ({ id: product.id, title: localeText(product.title), maker: authorName(product.makerId), price: price(product) }))"
    />

    <section
      id="vision"
      aria-labelledby="vision-title"
      class="scroll-mt-24 py-section"
    >
      <UContainer>
        <div class="grid gap-8 lg:grid-cols-2 lg:gap-20">
          <h2
            id="vision-title"
            class="max-w-lg text-3xl leading-tight font-semibold tracking-tight text-forest sm:text-4xl"
          >
            {{ copy.vision }}
          </h2>
          <p class="max-w-reading text-lead text-muted">
            {{ copy.visionText }}
          </p>
        </div>
        <div class="mt-12 grid gap-8 md:grid-cols-3">
          <div
            v-for="value in copy.values"
            :key="value.title"
            class="border-t border-default pt-6"
          >
            <UIcon
              :name="value.icon"
              class="size-7 text-forest"
              aria-hidden="true"
            />
            <h3 class="mt-4 text-lg font-semibold text-forest">
              {{ value.title }}
            </h3>
            <p class="mt-2 max-w-sm leading-relaxed text-muted">
              {{ value.text }}
            </p>
          </div>
        </div>
      </UContainer>
    </section>

    <section
      aria-labelledby="connection-title"
      class="bg-forest py-section text-porcelain"
    >
      <UContainer>
        <div class="max-w-reading">
          <h2
            id="connection-title"
            class="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl"
          >
            {{ copy.connection }}
          </h2>
          <p class="mt-5 text-lead">
            {{ copy.connectionText }}
          </p>
        </div>
        <div class="mt-10 grid gap-8 sm:grid-cols-2 sm:gap-16">
          <div class="border-t border-sage/40 pt-6">
            <h3 class="text-2xl font-medium">
              {{ copy.graz }}
            </h3>
            <p class="mt-3 max-w-sm leading-relaxed">
              {{ copy.grazText }}
            </p>
          </div>
          <div class="border-t border-sage/40 pt-6">
            <h3 class="text-2xl font-medium">
              {{ copy.nz }}
            </h3>
            <p class="mt-3 max-w-sm leading-relaxed">
              {{ copy.nzText }}
            </p>
          </div>
        </div>
        <p class="mt-10 max-w-reading text-sm leading-relaxed">
          {{ copy.connectionNote }}
        </p>
      </UContainer>
    </section>

    <section
      id="community"
      class="scroll-mt-24 py-section"
      :aria-label="copy.community"
    >
      <UContainer>
        <HomeSectionHeading
          :title="copy.community"
          :description="copy.communityText"
        />
        <div
          v-if="featuredMembers.length"
          class="grid gap-10 md:grid-cols-3 md:gap-6"
        >
          <HomeMemberCard
            v-for="member in featuredMembers"
            :key="member.user.id"
            :name="member.user.displayName"
            :place="member.profile.place"
            :bio="localeText(member.profile.bio)"
            :action="copy.profile"
            :image-label="copy.portrait"
            @preview="showPreview(member.user.displayName, member.profile.place, localeText(member.profile.bio))"
          />
        </div>
        <p
          v-else
          class="text-muted"
        >
          {{ copy.empty }}
        </p>
      </UContainer>
    </section>

    <section
      id="stories"
      class="scroll-mt-24 bg-sisterhood-50 py-section"
      :aria-label="copy.storyTitle"
    >
      <UContainer>
        <HomeSectionHeading
          :title="copy.storyTitle"
          :description="copy.storyText"
        />
        <p class="mb-6 text-sm text-muted">
          {{ copy.original }}
        </p>
        <div
          v-if="featuredPosts.length"
          class="grid gap-6 lg:grid-cols-3"
        >
          <article
            v-for="post in featuredPosts"
            :key="post.id"
            class="flex flex-col rounded-card border border-default bg-porcelain p-card"
          >
            <p class="text-sm font-medium text-terracotta">
              {{ copy.tags[post.tag] }}
            </p>
            <h3
              lang="en"
              class="mt-4 text-xl leading-snug font-semibold text-forest"
            >
              {{ post.title }}
            </h3>
            <p
              lang="en"
              class="mt-4 line-clamp-3 leading-relaxed text-muted"
            >
              {{ post.body }}
            </p>
            <p class="mt-5 text-sm text-graphite">
              {{ authorName(post.authorUserId) }}
            </p>
            <div class="mt-auto pt-6">
              <UButton
                :label="copy.read"
                variant="link"
                class="px-0"
                @click="showPost(post)"
              />
            </div>
          </article>
        </div>
        <p
          v-else
          class="text-muted"
        >
          {{ copy.empty }}
        </p>
      </UContainer>
    </section>

    <section
      id="marketplace"
      class="scroll-mt-24 py-section"
      :aria-label="copy.market"
    >
      <UContainer>
        <HomeSectionHeading
          :title="copy.market"
          :description="copy.marketText"
        />
        <div
          v-if="featuredProducts.length"
          class="grid gap-10 md:grid-cols-3 md:gap-6"
        >
          <article
            v-for="product in featuredProducts"
            :key="product.id"
            class="flex flex-col"
          >
            <HomeImagePlaceholder
              :label="copy.portrait"
              icon="i-lucide-package"
              tone="rose"
              class="aspect-4/3"
            />
            <p class="mt-5 text-sm text-muted">
              {{ authorName(product.makerId) }}
            </p>
            <h3 class="mt-2 text-xl font-semibold text-forest">
              {{ localeText(product.title) }}
            </h3>
            <p class="mt-2 font-medium text-graphite">
              {{ price(product) }}
            </p>
            <div class="mt-auto pt-5">
              <UButton
                :label="copy.product"
                variant="outline"
                @click="showPreview(localeText(product.title), `${authorName(product.makerId)} — ${price(product)}`, localeText(product.description))"
              />
            </div>
          </article>
        </div>
        <p
          v-else
          class="text-muted"
        >
          {{ copy.empty }}
        </p>
      </UContainer>
    </section>

    <section
      class="bg-rose-quartz py-section"
      :aria-label="copy.invitation"
    >
      <UContainer class="grid items-center gap-8 lg:grid-cols-2">
        <div>
          <h2 class="text-3xl leading-tight font-semibold tracking-tight text-forest sm:text-4xl">
            {{ copy.invitation }}
          </h2>
          <p class="mt-5 max-w-lg text-lead text-graphite">
            {{ copy.invitationText }}
          </p>
        </div>
        <div class="lg:justify-self-end">
          <UButton
            :label="copy.invitationButton"
            to="#community"
            size="xl"
          />
          <p class="mt-4 max-w-sm text-sm leading-relaxed text-graphite">
            {{ copy.invitationNote }}
          </p>
        </div>
      </UContainer>
    </section>

    <UModal
      v-model:open="previewOpen"
      :title="preview.title"
      :description="preview.subtitle"
    >
      <template #body>
        <p
          :lang="preview.lang"
          class="leading-relaxed whitespace-pre-line text-graphite"
        >
          {{ preview.body }}
        </p>
        <p class="mt-6 border-t border-default pt-4 text-sm leading-relaxed text-muted">
          {{ copy.previewNote }}
        </p>
      </template>
      <template #footer>
        <UButton
          :label="copy.close"
          variant="outline"
          @click="previewOpen = false"
        />
      </template>
    </UModal>
  </div>
</template>
