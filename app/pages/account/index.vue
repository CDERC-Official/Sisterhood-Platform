<script setup lang="ts">
const { t } = useI18n()
const { user } = useAuth()

useHead({
  title: () => t('auth.title')
})
</script>

<template>
  <UContainer>
    <div class="mx-auto flex w-full max-w-md flex-col gap-4 py-16">
      <h1 class="text-2xl font-semibold text-highlighted">
        {{ t('auth.title') }}
      </h1>
      <p
        v-if="user"
        class="text-muted"
      >
        {{ t('auth.signedIn', { name: user.displayName }) }}
      </p>
    </div>
  </UContainer>
</template>
