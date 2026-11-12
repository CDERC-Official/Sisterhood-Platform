<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
usePublicSeo(() => t('about.title'), () => t('about.description'))
const themes = ['exchange', 'craft', 'support'] as const
</script>

<template>
  <div>
    <UContainer class="py-section">
      <div class="grid items-start gap-10 lg:grid-cols-[3fr_2fr] lg:gap-16">
        <header class="max-w-reading">
          <p class="mb-5 text-sm font-semibold text-terracotta">
            {{ t('about.title') }}
          </p>
          <h1 class="text-display font-semibold wrap-break-word text-forest">
            {{ t('about.heading') }}
          </h1>
          <p class="mt-6 text-lead text-graphite">
            {{ t('about.intro') }}
          </p>
        </header>
        <aside
          :aria-label="t('about.draftTitle')"
          class="rounded-card bg-forest p-card text-porcelain"
        >
          <h2 class="text-2xl font-semibold">
            {{ t('about.draftTitle') }}
          </h2>
          <p class="mt-4 leading-relaxed">
            {{ t('about.draftText') }}
          </p>
        </aside>
      </div>
      <section
        aria-labelledby="about-together"
        class="mt-16 border-t border-default pt-10"
      >
        <h2
          id="about-together"
          class="max-w-reading text-3xl font-semibold text-forest"
        >
          {{ t('about.together') }}
        </h2>
        <div class="mt-8 grid gap-8 md:grid-cols-3">
          <div
            v-for="theme in themes"
            :key="theme"
            class="max-w-reading"
          >
            <h3 class="text-xl font-semibold text-forest">
              {{ t(`about.${theme}Title`) }}
            </h3>
            <p class="mt-3 leading-relaxed text-muted">
              {{ t(`about.${theme}Text`) }}
            </p>
          </div>
        </div>
      </section>
    </UContainer>
    <section
      aria-labelledby="about-world"
      class="bg-sage py-section"
    >
      <UContainer>
        <h2
          id="about-world"
          class="max-w-reading text-3xl font-semibold text-forest"
        >
          {{ t('about.world') }}
        </h2>
        <p class="mt-5 max-w-reading text-lead">
          {{ t('about.worldText') }}
        </p>
        <div class="mt-10 grid gap-10 md:grid-cols-2 md:gap-16">
          <div class="border-t border-forest/30 pt-6">
            <h3 class="text-xl font-semibold text-forest">
              {{ t('about.visionTitle') }}
            </h3>
            <p class="mt-3 max-w-reading leading-relaxed">
              {{ t('about.visionText') }}
            </p>
          </div>
          <div class="border-t border-forest/30 pt-6">
            <h3 class="text-xl font-semibold text-forest">
              {{ t('about.examplesTitle') }}
            </h3>
            <p class="mt-3 max-w-reading leading-relaxed">
              {{ t('about.examplesText') }}
            </p>
          </div>
        </div>
      </UContainer>
    </section>
    <UContainer class="py-section">
      <section
        aria-labelledby="about-discover"
        class="max-w-reading"
      >
        <h2
          id="about-discover"
          class="text-3xl font-semibold text-forest"
        >
          {{ t('about.discoverTitle') }}
        </h2>
        <p class="mt-5 text-lead text-muted">
          {{ t('about.discoverText') }}
        </p>
        <div class="mt-7 flex flex-wrap gap-3">
          <UButton
            :to="localePath('/community')"
            :label="t('about.community')"
            size="lg"
          />
          <UButton
            :to="localePath('/members')"
            :label="t('about.members')"
            variant="outline"
            size="lg"
          />
        </div>
      </section>
    </UContainer>
  </div>
</template>
