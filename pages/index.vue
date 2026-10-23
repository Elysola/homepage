<script setup lang="ts">
const localePath = useLocalePath()
const { t } = useI18n()

usePageSeo({
  title: computed(() => t('seo.homeTitle')),
  description: computed(() => t('hero.subtitle')),
  jsonLd: computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Elysola',
    url: 'https://elysola.org/',
    description: t('hero.subtitle'),
    inLanguage: t('seo.homeTitle').startsWith('Elysola:') ? 'en-US' : 'zh-CN',
    publisher: { '@id': 'https://elysola.org/#organization' },
  })),
})

defineOgImage('Default.takumi', {
  title: 'Elysola',
})

const principles = computed(() => [
  t('features.oss'),
  t('features.community'),
  t('features.transparent'),
  t('features.permissive'),
])
</script>

<template>
  <main>
    <section class="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
      <div class="max-w-3xl animate-fade-up text-center">
        <AppLogo class="mx-auto h-16 w-16" />
        <!-- Hero display type: marketing exception above the page-title scale -->
        <h1 class="mt-8 text-5xl font-bold tracking-tight text-primary sm:text-6xl">
          {{ $t('seo.homeTitle') }}
        </h1>
        <p class="mt-4 text-2xl font-semibold text-action sm:text-3xl">{{ $t('hero.motto') }}</p>

        <p class="mx-auto mt-6 max-w-xl text-lg text-secondary">
          {{ $t('hero.subtitle') }}
        </p>

        <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
          <NuxtLink :to="localePath('/projects')" class="btn btn-primary btn-lg group">
            {{ $t('hero.cta') }}
            <svg class="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </NuxtLink>
          <NuxtLink :to="localePath('/team')" class="btn btn-secondary btn-lg">
            {{ $t('hero.demo') }}
          </NuxtLink>
        </div>

        <ul class="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-3 border-t border-default pt-6">
          <li v-for="principle in principles" :key="principle" class="inline-flex items-center gap-2 text-sm font-medium text-muted">
            <svg class="h-4 w-4 text-action" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="m3.25 8.1 2.8 2.75 6.7-6.3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" />
            </svg>
            {{ principle }}
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>
