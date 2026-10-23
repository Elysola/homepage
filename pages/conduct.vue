<script setup lang="ts">
import DOMPurify from 'isomorphic-dompurify'
import { marked } from 'marked'

const { t, locale } = useI18n()
const files = import.meta.glob('/content/{en,zh}/conduct.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>

const tableOfContents = computed(() => (locale.value.startsWith('zh')
  ? [
      { id: 'pledge', label: '我们的承诺' },
      { id: 'expected-behavior', label: '倡导的行为' },
      { id: 'unacceptable-behavior', label: '不可接受的行为' },
      { id: 'enforcement', label: '执行方式' },
      { id: 'scope', label: '适用范围' },
      { id: 'reporting', label: '举报方式' },
    ]
  : [
      { id: 'pledge', label: 'Our Pledge' },
      { id: 'expected-behavior', label: 'Expected Behavior' },
      { id: 'unacceptable-behavior', label: 'Unacceptable Behavior' },
      { id: 'enforcement', label: 'Enforcement' },
      { id: 'scope', label: 'Scope' },
      { id: 'reporting', label: 'Reporting' },
    ]
))

const html = computed(() => {
  const lang = locale.value.startsWith('zh') ? 'zh' : 'en'
  const raw = files[`/content/${lang}/conduct.md`]
  if (!raw) return ''

  const headings = tableOfContents.value
  let headingIndex = 0
  marked.use({
    renderer: {
      heading({ text, depth }) {
        if (depth !== 2) return `<h${depth}>${text}</h${depth}>`
        const heading = headings[headingIndex++]
        return `<h2 id="${heading?.id ?? `section-${headingIndex}`}">${text}</h2>`
      },
    },
  })
  return DOMPurify.sanitize(marked.parse(raw) as string, {
    ALLOWED_TAGS: ['a', 'blockquote', 'br', 'code', 'em', 'h1', 'h2', 'h3', 'h4', 'hr', 'li', 'ol', 'p', 'pre', 'strong', 'ul'],
    ALLOWED_ATTR: ['href', 'id', 'rel', 'target'],
  }).replaceAll('<a ', '<a target="_blank" rel="noopener noreferrer" ')
})

usePageSeo({
  title: computed(() => t('nav.conduct')),
  description: computed(() => locale.value.startsWith('zh') ? '我们的社区承诺：开放、友好且公平。' : 'Our commitment to an open, welcoming, and fair community.'),
  type: 'article',
  jsonLd: computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: t('nav.conduct'),
    description: locale.value.startsWith('zh') ? '我们的社区承诺：开放、友好且公平。' : 'Our commitment to an open, welcoming, and fair community.',
    author: { '@type': 'Organization', name: 'Elysola' },
    publisher: { '@type': 'Organization', name: 'Elysola', logo: { '@type': 'ImageObject', url: 'https://elysola.org/favicon.png' } },
    mainEntityOfPage: `https://elysola.org${locale.value === 'en' ? '/en/conduct' : '/conduct'}`,
  })),
})
defineOgImage('Default.takumi', { title: t('nav.conduct', 'en') })
</script>

<template>
  <main class="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
    <header class="page-header">
      <p class="page-eyebrow">Community</p>
      <h1 class="page-title">{{ t('nav.conduct') }}</h1>
      <p class="page-summary">{{ locale.startsWith('zh') ? '我们的社区承诺：开放、友好且公平。' : 'Our commitment to an open, welcoming, and fair community.' }}</p>
    </header>

    <div class="mt-8 grid gap-8 lg:grid-cols-[12rem_1fr]">
      <aside class="hidden lg:block">
        <nav class="sticky top-24" :aria-label="locale.startsWith('zh') ? '成员守则目录' : 'Code of Conduct contents'">
          <p class="text-xs font-medium text-muted">{{ locale.startsWith('zh') ? '目录' : 'Contents' }}</p>
          <ol class="mt-3 space-y-1 border-l border-default">
            <li v-for="item in tableOfContents" :key="item.id">
              <a :href="`#${item.id}`" class="-ml-px block border-l border-transparent py-1 pl-3 text-sm text-muted transition-colors hover:border-action hover:text-action">{{ item.label }}</a>
            </li>
          </ol>
        </nav>
      </aside>
      <!-- Markdown is repository-managed content. -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <article v-if="html" class="conduct-prose prose-studio card p-6 sm:p-8" v-html="html" />
      <div v-else class="empty-state">{{ t('nav.conduct') }}</div>
    </div>
  </main>
</template>

<style scoped>
.conduct-prose :deep(h1) { @apply hidden; }
.conduct-prose :deep(h2) { @apply scroll-mt-24; }
.conduct-prose :deep(h2:first-of-type) { @apply mt-0; }
</style>
