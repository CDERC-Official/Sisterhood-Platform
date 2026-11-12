<script setup lang="ts">
type FieldError = {
  name: string
  message: string
}

type JoinState = {
  email: string
  password: string
  displayName: string
  attested: boolean
  isMaker: boolean
}

type LoginState = {
  email: string
  password: string
}

const { t } = useI18n()
const route = useRoute()
const { user, register, login } = useAuth()

usePublicSeo(() => t('auth.title'), () => t('seo.auth'))

const mode = ref<'join' | 'login'>('join')
const joinAlert = ref('')
const loginAlert = ref('')

function leaveAuth() {
  return navigateAfterAuth(route.query.returnTo)
}

// Signed-in visitors (including post-join/login) leave for returnTo or /account.
watch(user, (value) => {
  if (value) leaveAuth()
}, { immediate: true })

const joinState = reactive<JoinState>({
  email: '',
  password: '',
  displayName: '',
  attested: false,
  isMaker: false
})

const loginState = reactive<LoginState>({
  email: '',
  password: ''
})

const tabs = computed(() => [
  { label: t('auth.join'), value: 'join', slot: 'join' },
  { label: t('auth.login'), value: 'login', slot: 'login' }
])

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function validateJoin(state: Partial<JoinState>): FieldError[] {
  const errors: FieldError[] = []
  if (!state.email?.trim() || !isEmail(state.email)) {
    errors.push({ name: 'email', message: t('auth.errors.email') })
  }
  if (!state.password) {
    errors.push({ name: 'password', message: t('auth.errors.password') })
  }
  if (!state.displayName?.trim()) {
    errors.push({ name: 'displayName', message: t('auth.errors.displayName') })
  }
  return errors
}

function validateLogin(state: Partial<LoginState>): FieldError[] {
  const errors: FieldError[] = []
  if (!state.email?.trim() || !isEmail(state.email)) {
    errors.push({ name: 'email', message: t('auth.errors.email') })
  }
  if (!state.password) {
    errors.push({ name: 'password', message: t('auth.errors.password') })
  }
  return errors
}

function resetJoin() {
  joinState.email = ''
  joinState.password = ''
  joinState.displayName = ''
  joinState.attested = false
  joinState.isMaker = false
}

function onJoin() {
  if (!joinState.attested) return

  joinAlert.value = ''
  const result = register({
    email: joinState.email,
    password: joinState.password,
    displayName: joinState.displayName,
    isMaker: joinState.isMaker
  })

  if (result.ok) {
    resetJoin()
    return
  }

  joinAlert.value = result.error === 'duplicate-email'
    ? t('auth.errors.duplicateEmail')
    : t('auth.errors.invalidAccount')
}

function onLogin() {
  loginAlert.value = ''
  const result = login({
    email: loginState.email,
    password: loginState.password
  })

  if (result.ok) {
    loginState.password = ''
    return
  }

  loginAlert.value = t('auth.errors.invalidCredentials')
}

watch(() => joinState.email, () => {
  joinAlert.value = ''
})

watch(() => [loginState.email, loginState.password], () => {
  loginAlert.value = ''
})
</script>

<template>
  <UContainer>
    <div class="mx-auto flex w-full max-w-md flex-col gap-8 py-16">
      <header class="flex flex-col gap-2">
        <h1 class="text-2xl font-semibold text-highlighted">
          {{ t('auth.title') }}
        </h1>
        <p class="text-muted">
          {{ t('auth.lead') }}
        </p>
      </header>

      <UTabs
        v-model="mode"
        :items="tabs"
        :unmount-on-hide="false"
        class="w-full"
        :ui="{ content: 'pt-6' }"
      >
        <template #join>
          <UForm
            :state="joinState"
            :validate="validateJoin"
            :loading-auto="false"
            novalidate
            class="flex flex-col gap-4"
            @submit="onJoin"
          >
            <UAlert
              v-if="joinAlert"
              color="error"
              variant="subtle"
              icon="i-lucide-circle-alert"
              role="alert"
              :title="joinAlert"
            />

            <UFormField
              name="email"
              :label="t('auth.email')"
              required
            >
              <UInput
                v-model="joinState.email"
                type="email"
                autocomplete="email"
                class="w-full"
              />
            </UFormField>

            <UFormField
              name="password"
              :label="t('auth.password')"
              required
            >
              <UInput
                v-model="joinState.password"
                type="password"
                autocomplete="new-password"
                class="w-full"
              />
            </UFormField>

            <UFormField
              name="displayName"
              :label="t('auth.displayName')"
              required
            >
              <UInput
                v-model="joinState.displayName"
                autocomplete="nickname"
                class="w-full"
              />
            </UFormField>

            <UFormField name="attested">
              <UCheckbox
                v-model="joinState.attested"
                :label="t('auth.attest')"
                required
              />
            </UFormField>

            <UFormField name="isMaker">
              <UCheckbox
                v-model="joinState.isMaker"
                :label="t('auth.maker')"
              />
            </UFormField>

            <UButton
              type="submit"
              class="self-start"
              :disabled="!joinState.attested"
            >
              {{ t('auth.joinSubmit') }}
            </UButton>
          </UForm>
        </template>

        <template #login>
          <UForm
            :state="loginState"
            :validate="validateLogin"
            :loading-auto="false"
            novalidate
            class="flex flex-col gap-4"
            @submit="onLogin"
          >
            <UAlert
              v-if="loginAlert"
              color="error"
              variant="subtle"
              icon="i-lucide-circle-alert"
              role="alert"
              :title="loginAlert"
            />

            <UFormField
              name="email"
              :label="t('auth.email')"
              required
            >
              <UInput
                v-model="loginState.email"
                type="email"
                autocomplete="email"
                class="w-full"
              />
            </UFormField>

            <UFormField
              name="password"
              :label="t('auth.password')"
              required
            >
              <UInput
                v-model="loginState.password"
                type="password"
                autocomplete="current-password"
                class="w-full"
              />
            </UFormField>

            <p class="text-sm text-muted">
              {{ t('auth.demoHint') }}
            </p>

            <UButton
              type="submit"
              class="self-start"
            >
              {{ t('auth.loginSubmit') }}
            </UButton>
          </UForm>
        </template>
      </UTabs>
    </div>
  </UContainer>
</template>
