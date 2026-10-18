<script setup lang="ts">
const { t, te, locale } = useI18n()

interface Repo { name: string; description: string; url: string; language: string; stars: number; topics: string[]; homepage: string }
const { data: repos, pending, error, refresh } = await useFetch<Repo[]>('/api/repos', {
  key: 'public-repositories',
  retry: 1,
})

function retryProjects() {
  void refresh()
}

function repoDescription(repo: Repo) {
  const key = `projects.descriptions.${repo.name}`
  return te(key, locale.value) ? t(key) : (repo.description || t('projects.noDescription'))
}

usePageSeo({
  title: t('projects.title'),
  description: t('projects.subtitle'),
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t('projects.title'),
    description: t('projects.subtitle'),
    url: 'https://elysola.org/projects',
  },
})
defineOgImage('Default.takumi', { title: t('projects.title', 'en'), description: t('projects.subtitle', 'en') })
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
    <header class="page-header flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="page-eyebrow">Projects</p>
        <h1 class="page-title">{{ t('projects.title') }}</h1>
        <p class="page-summary">{{ t('projects.subtitle') }}</p>
      </div>
      <p v-if="repos?.length" class="text-sm text-muted"><span class="font-mono font-medium tabular-nums text-primary">{{ repos.length }}</span> repositories</p>
    </header>

    <div v-if="pending" class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
      <div v-for="item in 6" :key="item" class="card h-56 animate-pulse bg-muted" />
    </div>
    <div v-else-if="error" class="empty-state mt-8" role="alert">
      <svg class="h-6 w-6 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008V12H12v-.008Z" /></svg>
      <p class="text-secondary">{{ t('projects.error') }}</p>
      <button type="button" class="btn btn-secondary btn-sm" @click="retryProjects">{{ t('projects.retry') }}</button>
    </div>
    <ul v-else-if="repos?.length" class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="repo in repos" :key="repo.name">
        <a :href="repo.url" target="_blank" rel="noopener noreferrer" class="card-interactive group flex h-full flex-col p-6">
          <div class="flex items-start justify-between gap-4">
            <h2 class="card-title break-words group-hover:text-action">{{ repo.name }}</h2>
            <span class="inline-flex shrink-0 items-center gap-1 text-sm text-muted" :title="`${repo.stars} stars`">
              <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" /></svg>
              <span class="font-mono tabular-nums">{{ repo.stars }}</span>
              <span class="sr-only">stars</span>
            </span>
          </div>
          <p class="mt-2 line-clamp-3 flex-1 text-sm text-secondary">{{ repoDescription(repo) }}</p>
          <div v-if="repo.language || repo.topics.length" class="mt-4 flex flex-wrap gap-2">
            <span v-if="repo.language" class="badge badge-accent">{{ repo.language }}</span>
            <span v-for="topic in repo.topics.slice(0, 2)" :key="topic" class="badge">{{ topic }}</span>
          </div>
        </a>
      </li>
    </ul>
    <div v-else class="empty-state mt-8"><p>{{ t('projects.empty') }}</p></div>
  </main>
</template>
