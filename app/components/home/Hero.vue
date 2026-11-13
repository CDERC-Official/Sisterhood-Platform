<script setup lang="ts">
import type { homeCopy } from '~/data/home-copy'

defineProps<{
  copy: typeof homeCopy.de | typeof homeCopy.en
  members: { id: string, name: string, place: string, portraitImageUrl: string }[]
  products: { id: string, title: string, maker: string, price: string, imageSrc?: string }[]
}>()
const localePath = useLocalePath()
</script>

<template>
  <section
    aria-labelledby="home-title"
    data-home-hero
  >
    <img
      src="/images/home/workshop-hero.png"
      :alt="copy.imageAlt"
      width="1672"
      height="941"
      fetchpriority="high"
      data-hero-image
    >

    <UContainer data-hero-content>
      <div data-hero-intro>
        <h1
          id="home-title"
          class="max-w-xl text-display font-semibold text-forest lg:text-porcelain"
        >
          {{ copy.title }}
        </h1>
        <p class="mt-6 max-w-lg text-lead">
          {{ copy.intro }}
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <UButton
            :label="copy.discover"
            :to="localePath('/community')"
            size="xl"
            class="bg-terracotta text-white hover:bg-terracotta/90"
          />
          <UButton
            :label="copy.visionLink"
            to="#vision"
            size="xl"
            variant="outline"
            class="text-forest ring-forest/60 hover:bg-sage lg:text-porcelain lg:ring-porcelain/70 lg:hover:bg-white/10"
          />
        </div>
        <p class="mt-6 max-w-lg text-sm leading-relaxed">
          {{ copy.demo }}
        </p>
      </div>

      <div
        v-if="members.length || products.length"
        data-hero-preview
      >
        <div v-if="members.length">
          <h2 class="text-xl font-semibold text-forest">
            {{ copy.heroMembers }}
          </h2>
          <div class="mt-5 grid grid-cols-3 gap-3">
            <NuxtLink
              v-for="member in members"
              :key="member.id"
              :to="localePath(`/members/${member.id}`)"
              class="group rounded-md"
            >
              <MemberPortrait
                :src="member.portraitImageUrl"
                :name="member.name"
              />
              <p class="mt-2 text-sm font-semibold text-forest">{{ member.name }}</p>
              <p class="mt-1 text-xs text-muted">{{ member.place }}</p>
            </NuxtLink>
          </div>
        </div>

        <div
          v-if="products.length"
          class="mt-6 border-t border-default pt-5"
        >
          <h2 class="text-xl font-semibold text-forest">
            {{ copy.heroProducts }}
          </h2>
          <div class="mt-4 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 sm:gap-3">
            <a
              v-for="product in products"
              :key="product.id"
              href="#marketplace"
              class="group min-w-0 rounded-md"
            >
              <HomeProductImage
                :src="product.imageSrc"
                :title="product.title"
              />
              <p class="mt-2 text-sm font-medium wrap-anywhere text-forest">{{ product.title }}</p>
              <p class="mt-1 text-xs wrap-anywhere text-muted">{{ product.maker }}</p>
            </a>
          </div>
        </div>
      </div>

      <p
        data-hero-credit
        class="text-xs text-muted"
      >
        {{ copy.imageNote }}
      </p>
    </UContainer>
  </section>
</template>

<style scoped>
[data-home-hero] {
  position: relative;
  isolation: isolate;
  background: var(--color-porcelain);
}

[data-hero-image] {
  display: block;
  width: 100%;
  height: clamp(16rem, 48vw, 30rem);
  object-fit: cover;
  object-position: 62% 35%;
}

[data-hero-content] {
  display: grid;
  gap: 2rem;
  padding-top: 2rem;
  padding-bottom: 1.5rem;
}

[data-hero-intro] {
  padding-bottom: 1rem;
  color: var(--color-graphite);
}

[data-hero-preview] {
  padding: clamp(1.25rem, 3vw, 2rem);
  border-radius: var(--radius-card);
  background: var(--color-porcelain);
}

[data-hero-credit] {
  grid-column: 1 / -1;
}

@media (min-width: 1024px) {
  [data-hero-content] {
    grid-template-columns: 1fr 1fr;
    align-items: end;
    column-gap: 3rem;
    padding-top: clamp(16rem, 26vw, 24rem);
  }

  [data-hero-image] {
    position: absolute;
    inset: 0 0 auto;
    z-index: -1;
    height: 42rem;
    object-position: center 30%;
  }

  [data-hero-intro] {
    padding: 2rem;
    border-radius: var(--radius-card);
    background: rgb(21 43 33 / 94%);
    color: var(--color-porcelain);
  }
}
</style>
