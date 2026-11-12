<script setup lang="ts">
import { filterMembers } from '~/utils/members'

const { t } = useI18n()
const localePath = useLocalePath()
const { localeText } = useLocaleText()
const { members } = useMembers()
const name = ref('')
const place = ref('')
const places = computed(() => [...new Set(members.value.map(member => member.place).filter(Boolean))].sort())
const filtered = computed(() => filterMembers(members.value, name.value, place.value))
useHead({ title: () => t('members.title') })
</script>

<template>
  <UContainer class="py-section">
    <header class="max-w-reading">
      <h1 class="text-display font-semibold text-forest">
        {{ t('members.title') }}
      </h1>
      <p class="mt-5 text-lead text-muted">
        {{ t('members.lead') }}
      </p>
    </header>
    <form
      class="my-10 grid gap-5 border-y border-default py-6 sm:grid-cols-2"
      role="search"
      @submit.prevent
    >
      <UFormField
        :label="t('members.search')"
        name="name"
      >
        <UInput
          v-model="name"
          type="search"
          icon="i-lucide-search"
          class="w-full"
        />
      </UFormField>
      <UFormField
        :label="t('members.location')"
        name="location"
      >
        <select
          v-model="place"
          class="min-h-9 w-full rounded-md border border-default bg-porcelain px-3 py-1.5 text-base"
        >
          <option value="">
            {{ t('members.allLocations') }}
          </option>
          <option
            v-for="location in places"
            :key="location"
            :value="location"
          >
            {{ location }}
          </option>
        </select>
      </UFormField>
    </form>
    <p
      class="mb-6 text-sm text-muted"
      role="status"
    >
      {{ t('members.count', { count: filtered.length }) }}
    </p>
    <UEmpty
      v-if="!filtered.length"
      :title="t('members.noResults')"
      :description="t('members.tryAgain')"
    >
      <template #actions>
        <UButton
          :label="t('members.reset')"
          @click="name = ''; place = ''"
        />
      </template>
    </UEmpty>
    <div
      v-else
      class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
    >
      <article
        v-for="member in filtered"
        :key="member.id"
        class="flex flex-col border-b border-default pb-8"
      >
        <NuxtLink :to="localePath(`/members/${member.id}`)">
          <MemberPortrait
            :src="member.portraitImageUrl"
            :name="member.displayName"
          />
        </NuxtLink>
        <h2 class="mt-5 text-xl font-semibold text-forest">
          <NuxtLink :to="localePath(`/members/${member.id}`)">{{ member.displayName }}</NuxtLink>
        </h2>
        <p class="mt-1 text-sm text-muted">
          {{ member.place || t('members.noLocation') }}
        </p>
        <p class="mt-4 line-clamp-3 text-graphite">
          {{ localeText(member.bio) || t('members.noBio') }}
        </p>
        <div class="mt-auto pt-5">
          <UButton
            :to="localePath(`/members/${member.id}`)"
            :label="t('members.viewProfile')"
            variant="outline"
          />
        </div>
      </article>
    </div>
  </UContainer>
</template>
