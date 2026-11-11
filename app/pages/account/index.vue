<script setup lang="ts">
import type { LocaleCode } from '#shared/types'

type FieldError = {
  name: string
  message: string
}

type ProfileState = {
  email: string
  displayName: string
  isMaker: boolean
  place: string
  bioEn: string
  bioDe: string
  portraitImageUrl: string
}

const { t, locale } = useI18n()
const localePath = useLocalePath()
const { user, logout, updateProfile, resetDemoData } = useAuth()
const { profiles, updateMakerProfile } = useMakers()

useHead({
  title: () => t('account.title')
})

const formAlert = ref<{ color: 'success' | 'error', title: string } | null>(null)
const bioLocale = ref<LocaleCode>('en')

const makerProfile = computed(() => {
  if (!user.value) return null
  return profiles.value.find(profile => profile.userId === user.value!.id) ?? null
})

const state = reactive<ProfileState>({
  email: '',
  displayName: '',
  isMaker: false,
  place: '',
  bioEn: '',
  bioDe: '',
  portraitImageUrl: ''
})

function syncFromUser() {
  if (!user.value) return
  state.email = user.value.email
  state.displayName = user.value.displayName
  state.isMaker = user.value.isMaker
  state.place = makerProfile.value?.place ?? ''
  state.bioEn = makerProfile.value?.bio.en ?? ''
  state.bioDe = makerProfile.value?.bio.de ?? ''
  state.portraitImageUrl = makerProfile.value?.portraitImageUrl ?? ''
}

watch([user, makerProfile], syncFromUser, { immediate: true })

const bioTabs = computed(() => [
  { label: t('account.bioEn'), value: 'en', slot: 'en' },
  { label: t('account.bioDe'), value: 'de', slot: 'de' }
])

function isHttpUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function validateProfile(form: Partial<ProfileState>): FieldError[] {
  const errors: FieldError[] = []
  if (!form.displayName?.trim()) {
    errors.push({ name: 'displayName', message: t('account.errors.displayName') })
  }
  if (user.value?.isMaker) {
    const portrait = form.portraitImageUrl?.trim() ?? ''
    if (portrait && !isHttpUrl(portrait)) {
      errors.push({ name: 'portraitImageUrl', message: t('account.errors.portrait') })
    }
  }
  return errors
}

function onSave() {
  if (!user.value) return

  formAlert.value = null
  const wasMaker = user.value.isMaker
  const result = updateProfile({
    displayName: state.displayName,
    ...(wasMaker ? {} : { isMaker: state.isMaker })
  })

  if (!result.ok) {
    formAlert.value = {
      color: 'error',
      title: t('account.errors.saveFailed')
    }
    return
  }

  if (result.user.isMaker && wasMaker) {
    updateMakerProfile(result.user.id, {
      place: state.place.trim(),
      bio: {
        en: state.bioEn,
        de: state.bioDe
      },
      portraitImageUrl: state.portraitImageUrl.trim()
    })
  }

  syncFromUser()
  formAlert.value = {
    color: 'success',
    title: t('account.saved')
  }
}

function onLogout() {
  logout()
  return navigateTo(localePath('/auth'))
}

function onResetDemo() {
  resetDemoData()
  return navigateTo(localePath('/auth'))
}

watch(locale, () => {
  // Keep the active bio tab aligned with the UI language when the visitor switches.
  if (locale.value === 'en' || locale.value === 'de') {
    bioLocale.value = locale.value
  }
}, { immediate: true })
</script>

<template>
  <UContainer>
    <div class="mx-auto flex w-full max-w-md flex-col gap-8 py-16">
      <header class="flex flex-col gap-2">
        <h1 class="text-2xl font-semibold text-highlighted">
          {{ t('account.title') }}
        </h1>
        <p class="text-muted">
          {{ t('account.lead') }}
        </p>
      </header>

      <UForm
        v-if="user"
        :state="state"
        :validate="validateProfile"
        :loading-auto="false"
        novalidate
        class="flex flex-col gap-4"
        @submit="onSave"
      >
        <UAlert
          v-if="formAlert"
          :color="formAlert.color"
          variant="subtle"
          :icon="formAlert.color === 'success' ? 'i-lucide-circle-check' : 'i-lucide-circle-alert'"
          role="status"
          :title="formAlert.title"
        />

        <UFormField
          name="email"
          :label="t('account.email')"
        >
          <UInput
            :model-value="state.email"
            type="email"
            readonly
            autocomplete="email"
            class="w-full"
          />
        </UFormField>

        <UFormField
          name="displayName"
          :label="t('account.displayName')"
          required
        >
          <UInput
            v-model="state.displayName"
            autocomplete="nickname"
            class="w-full"
          />
        </UFormField>

        <UFormField name="isMaker">
          <UCheckbox
            v-model="state.isMaker"
            :label="t('account.maker')"
            :disabled="user.isMaker"
          />
        </UFormField>

        <template v-if="user.isMaker">
          <UFormField
            name="place"
            :label="t('account.place')"
          >
            <UInput
              v-model="state.place"
              autocomplete="address-level2"
              class="w-full"
            />
          </UFormField>

          <div class="flex flex-col gap-3">
            <p class="text-sm font-medium text-default">
              {{ t('account.bio') }}
            </p>
            <UTabs
              v-model="bioLocale"
              :items="bioTabs"
              :unmount-on-hide="false"
              class="w-full"
              :ui="{ content: 'pt-3' }"
            >
              <template #en>
                <UFormField name="bioEn">
                  <UTextarea
                    v-model="state.bioEn"
                    :rows="4"
                    class="w-full"
                  />
                </UFormField>
              </template>
              <template #de>
                <UFormField name="bioDe">
                  <UTextarea
                    v-model="state.bioDe"
                    :rows="4"
                    class="w-full"
                  />
                </UFormField>
              </template>
            </UTabs>
          </div>

          <UFormField
            name="portraitImageUrl"
            :label="t('account.portrait')"
            :help="t('account.portraitHelp')"
          >
            <UInput
              v-model="state.portraitImageUrl"
              type="url"
              inputmode="url"
              autocomplete="off"
              class="w-full"
            />
          </UFormField>
        </template>

        <UButton
          type="submit"
          class="self-start"
        >
          {{ t('actions.save') }}
        </UButton>
      </UForm>

      <div
        v-if="user"
        class="flex flex-col gap-3 border-t border-default pt-6"
      >
        <UButton
          color="neutral"
          variant="outline"
          class="self-start"
          @click="onLogout"
        >
          {{ t('auth.logout') }}
        </UButton>

        <div class="flex flex-col gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            class="self-start"
            @click="onResetDemo"
          >
            {{ t('account.resetDemo') }}
          </UButton>
          <p class="text-sm text-muted">
            {{ t('account.resetHint') }}
          </p>
        </div>
      </div>
    </div>
  </UContainer>
</template>
