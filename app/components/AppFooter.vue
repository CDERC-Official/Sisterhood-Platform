<template>
  <UFooter
    class="border-t border-default bg-sage"
    :ui="{ container: 'gap-4 py-6', left: 'text-center lg:text-left', right: 'text-center lg:text-right' }"
  >
    <template #top>
      <UContainer class="grid gap-8 py-12 md:grid-cols-2 md:gap-16">
        <div>
          <NuxtLink
            to="/"
            aria-label="Sisterhood – Startseite"
            class="inline-flex rounded-md p-1 -ms-1"
          >
            <AppLogo />
          </NuxtLink>

          <p class="mt-4 max-w-reading text-base leading-relaxed text-graphite">
            Ein Ort für Frauen, ihre Geschichten und das, was sie gemeinsam bewegen.
          </p>
        </div>

        <div class="md:justify-self-end">
          <h2 class="text-lg font-semibold text-forest">
            Von Graz bis Neuseeland
          </h2>
          <p class="mt-3 max-w-sm text-sm leading-relaxed text-graphite">
            Hier beginnt unsere Idee: Erfahrungen teilen, Verbindungen schaffen
            und einander über Grenzen hinweg unterstützen.
          </p>
        </div>
      </UContainer>
    </template>

    <template #left>
      <p class="text-sm text-graphite">
        © {{ new Date().getFullYear() }} Sisterhood
      </p>
    </template>

    <template #right>
      <p class="text-sm text-graphite">
        Prototyp zur Präsentation. Inhalte und Funktionen im Aufbau.
      </p>
    </template>
  </UFooter>
</template>
