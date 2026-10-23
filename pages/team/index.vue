<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { members } = useMembers()
const failedAvatars = ref(new Set<string>())

function markAvatarFailed(slug: string) {
  failedAvatars.value = new Set(failedAvatars.value).add(slug)
}

usePageSeo({
  title: computed(() => t('team.title')),
  description: computed(() => t('team.subtitle')),
  jsonLd: computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: t('team.title'),
    description: t('team.subtitle'),
    url: `https://elysola.org${locale.value === 'en' ? '/en' : ''}/team`,
    inLanguage: locale.value === 'en' ? 'en-US' : 'zh-CN',
  })),
})
defineOgImage('Default.takumi', { title: t('team.title', 'en'), description: t('team.subtitle', 'en') })
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
    <header class="page-header flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="page-eyebrow">People</p>
        <h1 class="page-title">{{ t('team.title') }}</h1>
        <p class="page-summary">{{ t('team.subtitle') }}</p>
      </div>
      <p v-if="members.length" class="text-sm text-muted"><span class="font-mono font-medium tabular-nums text-primary">{{ members.length }}</span> contributors</p>
    </header>

    <div v-if="!members.length" class="empty-state mt-8">{{ t('team.empty') }}</div>
    <ul v-else class="mt-8 grid gap-4 md:grid-cols-2">
      <li v-for="member in members" :key="member.slug">
        <NuxtLink :to="localePath({ name: 'team-slug', params: { slug: member.slug } })" class="card-interactive group flex h-full gap-6 p-6">
          <img v-if="member.github && !failedAvatars.has(member.slug)" :src="useAvatarUrl(member.github)" :alt="member.name" width="64" height="64" loading="lazy" decoding="async" class="h-16 w-16 shrink-0 rounded-badge border border-default bg-elevated object-cover" @error="markAvatarFailed(member.slug)" />
          <div v-else class="flex h-16 w-16 shrink-0 items-center justify-center rounded-badge bg-accent text-xl font-semibold text-action" aria-hidden="true">{{ member.name.slice(0, 1) }}</div>
          <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between gap-3">
              <h2 class="card-title group-hover:text-action">{{ member.name }}</h2>
              <span class="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-action" aria-hidden="true">→</span>
            </div>
            <p class="mt-1 text-sm text-muted">{{ member.role }}</p>
            <p class="mt-3 text-sm text-secondary">“{{ member.motto }}”</p>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </main>
</template>
