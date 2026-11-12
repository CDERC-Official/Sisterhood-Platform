<script setup>
const { localeProperties } = useI18n()

useHead(() => ({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: localeProperties.value.language
  }
}))

useSeoMeta({
  twitterCard: 'summary'
})
</script>

<template>
  <UApp>
    <AppHeader />

    <UMain>
      <AppDemoNotice />
      <NuxtPage />
    </UMain>

    <AppFooter />
  </UApp>
</template>
