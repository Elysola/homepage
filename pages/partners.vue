<script setup lang="ts">
import { partners, type Partner } from '~/config/partners'

const { t, te, locale } = useI18n()
const partnerList = computed(() => partners.filter((partner) => partner.category === 'partner'))
const friendList = computed(() => partners.filter((partner) => partner.category === 'friend'))

function partnerDescription(partner: Partner) {
  const key = `partners.descriptions.${partner.name}`
  return te(key, locale.value) ? t(key) : ''
}

usePageSeo({
  title: computed(() => t('partners.title')),
  description: computed(() => t('partners.subtitle')),
  jsonLd: computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t('partners.title'),
    description: t('partners.subtitle'),
    url: `https://elysola.org${locale.value === 'en' ? '/en' : ''}/partners`,
    inLanguage: locale.value === 'en' ? 'en-US' : 'zh-CN',
  })),
})
defineOgImage('Default.takumi', { title: t('partners.title', 'en'), description: t('partners.subtitle', 'en') })
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
    <header class="page-header">
      <p class="page-eyebrow">Network</p>
      <h1 class="page-title">{{ t('partners.title') }}</h1>
      <p class="page-summary">{{ t('partners.subtitle') }}</p>
    </header>

    <section class="mt-12" aria-labelledby="partners-heading">
      <h2 id="partners-heading" class="section-title">{{ t('partners.sectionPartners') }}</h2>
      <ul v-if="partnerList.length" class="mt-4 grid gap-4 md:grid-cols-2">
        <li v-for="partner in partnerList" :key="partner.name">
          <a :href="partner.url" target="_blank" rel="noopener noreferrer" class="card-interactive group flex h-full flex-col p-6">
            <div class="flex items-start justify-between gap-4">
              <h3 class="card-title group-hover:text-action">{{ partner.name }}</h3>
              <span class="text-muted group-hover:text-action" aria-hidden="true">↗</span>
            </div>
            <p class="mt-2 text-sm text-secondary">{{ partnerDescription(partner) || partner.url.replace(/^https?:\/\//, '') }}</p>
            <p class="mt-4 font-mono text-xs text-muted">{{ partner.url.replace(/^https?:\/\//, '').replace(/\/$/, '') }}</p>
          </a>
        </li>
      </ul>
      <div v-else class="empty-state mt-4">{{ t('partners.empty') }}</div>
    </section>

    <section class="mt-12" aria-labelledby="friends-heading">
      <h2 id="friends-heading" class="section-title">{{ t('partners.sectionFriends') }}</h2>
      <ul v-if="friendList.length" class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="friend in friendList" :key="friend.name">
          <a :href="friend.url" target="_blank" rel="noopener noreferrer" class="card-interactive group flex items-center justify-between px-4 py-3 text-sm font-medium text-primary">
            <span class="group-hover:text-action">{{ friend.name }}</span>
            <span class="text-muted group-hover:text-action" aria-hidden="true">↗</span>
          </a>
        </li>
      </ul>
      <div v-else class="empty-state mt-4">{{ t('partners.empty') }}</div>
    </section>
  </main>
</template>
