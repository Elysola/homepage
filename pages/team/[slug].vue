<script setup lang="ts">
import { siGithub, siX, siDiscord, siMatrix, siTelegram, siBilibili, siGmail } from 'simple-icons'

const route = useRoute()
const localePath = useLocalePath()
const { member } = useMember(route.params.slug as string)
const { member: memberEn } = useMember(route.params.slug as string, 'en')
const { t } = useI18n()
const avatarFailed = ref(false)

if (!member.value) throw createError({ statusCode: 404, statusMessage: 'Member not found' })

const iconMap = { github: siGithub.path, x: siX.path, discord: siDiscord.path, matrix: siMatrix.path, telegram: siTelegram.path, bilibili: siBilibili.path, email: siGmail.path } as const
const socialLinks = computed(() => {
  const current = member.value!
  const links: Array<{ label: string; url: string; icon: string }> = []
  if (current.github) links.push({ label: 'GitHub', url: `https://github.com/${current.github}`, icon: iconMap.github })
  if (current.twitter) links.push({ label: 'X', url: `https://x.com/${current.twitter}`, icon: iconMap.x })
  if (current.website) links.push({ label: new URL(current.website).hostname, url: current.website, icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 15.39c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41A8.01 8.01 0 0 1 18.9 17.39ZM11 19.93C7.05 19.44 4 16.08 4 12c0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93Z' })
  if (current.matrix) links.push({ label: 'Matrix', url: `https://matrix.to/#/${current.matrix}`, icon: iconMap.matrix })
  if (current.discord) links.push({ label: 'Discord', url: `https://discord.gg/${current.discord}`, icon: iconMap.discord })
  if (current.telegram) links.push({ label: 'Telegram', url: `https://t.me/${current.telegram}`, icon: iconMap.telegram })
  if (current.bilibili) links.push({ label: 'Bilibili', url: `https://space.bilibili.com/${current.bilibili}`, icon: iconMap.bilibili })
  if (current.email) links.push({ label: 'Email', url: `mailto:${atob(current.email)}`, icon: iconMap.email })
  return links
})

usePageSeo({
  title: computed(() => member.value?.name ? `${member.value.name} — Elysola` : 'Elysola'),
  description: computed(() => [member.value?.name, member.value?.role, member.value?.motto].filter(Boolean).join(' — ') || 'Elysola team member'),
  type: 'profile',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: member.value?.name,
    jobTitle: member.value?.role,
    description: member.value?.motto,
    url: `https://elysola.org${route.path}`,
  },
})
defineOgImage('Default.takumi', { title: memberEn.value?.name || member.value?.name || '', description: memberEn.value?.role || '' })
</script>

<template>
  <main v-if="member" class="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
    <NuxtLink :to="localePath({ name: 'team' })" class="btn btn-ghost btn-sm -ml-3">
      <span aria-hidden="true">←</span>{{ t('team.back') }}
    </NuxtLink>

    <section class="card mt-6 p-6 sm:p-8">
      <div class="flex flex-col gap-6 sm:flex-row sm:items-start">
        <img v-if="member.github && !avatarFailed" :src="useAvatarUrl(member.github)" :alt="member.name" width="112" height="112" decoding="async" class="h-28 w-28 shrink-0 rounded-badge border border-default bg-elevated object-cover" @error="avatarFailed = true" />
        <div v-else class="flex h-28 w-28 shrink-0 items-center justify-center rounded-badge bg-accent text-3xl font-semibold text-action" aria-hidden="true">{{ member.name.slice(0, 1) }}</div>
        <div class="min-w-0">
          <p class="page-eyebrow">Member</p>
          <h1 class="page-title">{{ member.name }}</h1>
          <p class="mt-1 text-base font-medium text-muted">{{ member.role }}</p>
          <blockquote class="mt-4 max-w-xl border-l-2 border-default pl-4 text-sm text-secondary">“{{ member.motto }}”</blockquote>
          <ul v-if="socialLinks.length" class="mt-6 flex flex-wrap gap-2">
            <li v-for="link in socialLinks" :key="link.url">
              <a :href="link.url" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path :d="link.icon" /></svg>{{ link.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Member biography is parsed from repository-managed Markdown. -->
    <!-- eslint-disable-next-line vue/no-v-html -->
    <article v-if="member.bio" class="prose-studio card mt-8 p-6 sm:p-8" v-html="member.bio" />
  </main>
</template>
