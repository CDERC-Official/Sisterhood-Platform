<template>
  <UHeader
    title="Sisterhood"
    :toggle="false"
    class="bg-porcelain/95"
    :ui="{ container: 'gap-3', left: 'gap-6' }"
  >
    <template #left>
      <NuxtLink
        to="/"
        aria-label="Sisterhood – Startseite"
        class="rounded-md p-1 -ms-1"
      >
        <AppLogo />
      </NuxtLink>

      <p class="hidden text-sm text-muted md:block">
        Hier beginnt Verbindung.
      </p>
    </template>
  </UHeader>
</template>
