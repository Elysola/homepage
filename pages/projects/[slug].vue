<script setup lang="ts">
import { projectDefinitions } from '~/config/projects'

const route = useRoute()
const localePath = useLocalePath()
const { t, te, locale } = useI18n()
const slug = route.params.slug as string
const project = projectDefinitions.find((item) => item.slug === slug)

if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

const description = computed(() => {
  const key = `projects.descriptions.${project.name}`
  return te(key, locale.value) ? t(key) : t('projects.noDescription')
})
const pageUrl = computed(() => `https://elysola.org${locale.value === 'en' ? '/en' : ''}/projects/${project.slug}`)

usePageSeo({
  title: computed(() => `${project.name} — ${t('projects.details')}`),
  description,
  jsonLd: computed(() => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareSourceCode',
        name: project.name,
        description: description.value,
        codeRepository: project.repository,
        programmingLanguage: project.language,
        url: pageUrl.value,
        author: { '@id': 'https://elysola.org/#organization' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Elysola', item: `https://elysola.org${locale.value === 'en' ? '/en' : ''}` },
          { '@type': 'ListItem', position: 2, name: t('projects.title'), item: `https://elysola.org${locale.value === 'en' ? '/en' : ''}/projects` },
          { '@type': 'ListItem', position: 3, name: project.name, item: pageUrl.value },
        ],
      },
    ],
  })),
})
defineOgImage('Default.takumi', { title: project.name, description: t(`projects.descriptions.${project.name}`, 'en') })
</script>

<template>
  <main class="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
    <nav :aria-label="locale === 'en' ? 'Breadcrumb' : '面包屑导航'" class="text-sm text-muted">
      <NuxtLink :to="localePath('/')" class="hover:text-action">Elysola</NuxtLink>
      <span class="px-2" aria-hidden="true">/</span>
      <NuxtLink :to="localePath('/projects')" class="hover:text-action">{{ t('projects.title') }}</NuxtLink>
      <span class="px-2" aria-hidden="true">/</span>
      <span class="text-secondary">{{ project.name }}</span>
    </nav>

    <article class="card mt-6 p-6 sm:p-8">
      <p class="page-eyebrow">{{ t('projects.details') }}</p>
      <h1 class="page-title mt-2">{{ project.name }}</h1>
      <p class="page-summary">{{ description }}</p>

      <dl class="mt-8 grid gap-4 border-y border-default py-6 sm:grid-cols-2">
        <div>
          <dt class="text-xs font-medium uppercase tracking-wide text-muted">{{ t('projects.technology') }}</dt>
          <dd class="mt-1 text-sm font-medium text-primary">{{ project.language }}</dd>
        </div>
        <div>
          <dt class="text-xs font-medium uppercase tracking-wide text-muted">GitHub</dt>
          <dd class="mt-1 truncate text-sm"><a :href="project.repository" target="_blank" rel="noopener noreferrer" class="text-action hover:underline">{{ project.repository.replace('https://github.com/', '') }}</a></dd>
        </div>
      </dl>

      <div class="mt-8 flex flex-wrap gap-3">
        <a :href="project.repository" target="_blank" rel="noopener noreferrer" class="btn btn-primary">{{ t('projects.repository') }}</a>
        <a v-if="project.homepage" :href="project.homepage" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">{{ t('projects.website') }}</a>
        <NuxtLink :to="localePath('/projects')" class="btn btn-ghost">{{ t('projects.title') }}</NuxtLink>
      </div>
    </article>
  </main>
</template>
