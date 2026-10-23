<script setup lang="ts">
import { siteConfig } from '~/config/site'

const { locale, setLocale } = useI18n()
const localePath = useLocalePath()
const colorMode = useColorMode()

const navOpen = ref(false)
const menuButton = ref<HTMLButtonElement | null>(null)
const mobileNav = ref<HTMLElement | null>(null)
const emailLink = `/api/email/${siteConfig.email}`
const localeOptions = [
  { code: 'zh', name: '简体中文' },
  { code: 'en', name: 'English' },
]

function onLocaleChange(event: Event) {
  setLocale((event.target as HTMLSelectElement).value as 'zh' | 'en')
}

const navItems = [
  { path: '/', label: 'nav.home' },
  { path: '/projects', label: 'nav.projects' },
  { path: '/team', label: 'nav.team' },
  { path: '/partners', label: 'nav.partners' },
  { path: '/conduct', label: 'nav.conduct' },
]

const isDark = computed(() => colorMode.value === 'dark')
const themeLabel = computed(() => (isDark.value ? 'Switch to light mode' : 'Switch to dark mode'))

function toggleTheme() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

function closeNav() {
  navOpen.value = false
  nextTick(() => menuButton.value?.focus())
}

watch(navOpen, async (open) => {
  if (open) {
    await nextTick()
    mobileNav.value?.querySelector<HTMLElement>('a, button, select')?.focus()
  }
})

onMounted(() => {
  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && navOpen.value) closeNav()
  }
  window.addEventListener('keydown', onKeydown)
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
})

useHead(() => ({
  meta: [{ property: 'og:locale', content: locale.value === 'en' ? 'en_US' : 'zh_CN' }],
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://elysola.org/#organization',
      name: 'Elysola',
      url: 'https://elysola.org/',
      description: siteConfig.description,
      logo: { '@type': 'ImageObject', url: 'https://elysola.org/favicon.png' },
      sameAs: [
        'https://github.com/elysola',
        'https://x.com/ElysolaOrg',
        'https://t.me/ElysolaOrg',
        'https://discord.gg/PBxdFTRM8',
      ],
    }),
  }],
}))
</script>

<template>
  <div class="min-h-screen overflow-x-hidden bg-canvas font-sans text-secondary">
    <a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-control focus:bg-action focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-on-action">Skip to content</a>

    <header class="sticky top-0 z-30 border-b border-default bg-canvas">
      <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8" aria-label="Main">
        <NuxtLink :to="localePath('/')" class="flex items-center gap-2 rounded-control">
          <AppLogo class="h-8 w-8" />
          <span class="text-base font-bold text-primary">Elysola</span>
        </NuxtLink>

        <div class="hidden items-center gap-1 md:flex">
          <NuxtLink v-for="item in navItems" :key="item.path" :to="localePath(item.path)" class="nav-link">{{ $t(item.label) }}</NuxtLink>
        </div>

        <div class="hidden items-center gap-2 md:flex">
          <button type="button" class="btn-icon" :aria-label="themeLabel" :title="themeLabel" @click="toggleTheme">
            <svg v-if="isDark" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
            <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
          </button>
          <select :value="locale" aria-label="Switch language" class="input" @change="onLocaleChange">
            <option v-for="loc in localeOptions" :key="loc.code" :value="loc.code">{{ loc.name }}</option>
          </select>
          <a :href="emailLink" class="btn btn-primary btn-sm">{{ $t('nav.contact') }}</a>
        </div>

        <button ref="menuButton" type="button" class="btn-icon md:hidden" :aria-expanded="navOpen" aria-controls="mobile-nav" aria-label="Toggle navigation menu" @click="navOpen = !navOpen">
          <svg v-if="!navOpen" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
          <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
        </button>
      </nav>

      <div v-if="navOpen" id="mobile-nav" ref="mobileNav" class="border-t border-default bg-canvas px-4 pb-4 pt-2 md:hidden">
        <div class="grid gap-1">
          <NuxtLink v-for="item in navItems" :key="item.path" :to="localePath(item.path)" class="nav-link py-2 text-base" @click="closeNav">{{ $t(item.label) }}</NuxtLink>
          <div class="mt-3 flex items-center gap-2 border-t border-default pt-4">
            <button type="button" class="btn-icon" :aria-label="themeLabel" :title="themeLabel" @click="toggleTheme">
              <svg v-if="isDark" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
              <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
            </button>
            <select :value="locale" aria-label="Switch language" class="input" @change="onLocaleChange">
              <option v-for="loc in localeOptions" :key="loc.code" :value="loc.code">{{ loc.name }}</option>
            </select>
            <a :href="emailLink" class="btn btn-primary btn-sm ml-auto">{{ $t('nav.contact') }}</a>
          </div>
        </div>
      </div>
    </header>

    <div id="main-content" class="min-h-[calc(100vh-4rem)]">
      <NuxtPage />
    </div>

    <footer class="border-t border-default bg-muted">
      <div class="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-[1fr_auto] sm:items-end sm:px-6 lg:px-8">
        <div>
          <div class="flex items-center gap-2"><AppLogo class="h-6 w-6" /><span class="text-sm font-bold text-primary">Elysola</span></div>
          <p class="mt-3 max-w-md text-sm text-muted">{{ $t('hero.subtitle') }}</p>
          <p class="mt-4 text-xs text-muted">© {{ new Date().getFullYear() }} Elysola. {{ $t('footer.copyright') }}</p>
        </div>
        <div class="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium">
          <a href="https://github.com/elysola" target="_blank" rel="noopener noreferrer" class="footer-link"><IconGithub class="h-4 w-4" /> GitHub</a>
          <a v-if="siteConfig.social.twitter" :href="`https://x.com/${siteConfig.social.twitter}`" target="_blank" rel="noopener noreferrer" class="footer-link"><IconTwitter class="h-4 w-4" /> X</a>
          <a v-if="siteConfig.social.telegram" :href="`https://t.me/${siteConfig.social.telegram}`" target="_blank" rel="noopener noreferrer" class="footer-link"><IconTelegram class="h-4 w-4" /> Telegram</a>
          <a v-if="siteConfig.social.discord" :href="`https://discord.gg/${siteConfig.social.discord}`" target="_blank" rel="noopener noreferrer" class="footer-link"><IconDiscord class="h-4 w-4" /> Discord</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
.nav-link { @apply rounded-control px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-elevated hover:text-primary; }
.nav-link.router-link-exact-active { @apply bg-accent text-action; }
.footer-link { @apply inline-flex items-center gap-1.5 rounded-control text-muted transition-colors hover:text-action; }
.page-enter-active, .page-leave-active { transition: opacity .15s ease; }
.page-enter-from, .page-leave-to { opacity: 0; }
</style>
