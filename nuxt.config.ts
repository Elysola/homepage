import { projectDefinitions } from './config/projects'

export default defineNuxtConfig({
  compatibilityDate: '2026-06-24',
  site: {
    url: 'https://elysola.org',
  },
  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
    head: {
      title: 'Elysola',
      meta: [
        {
          name: 'description',
          content: 'We build open-source software. Fair, transparent, and community-driven.',
        },
        { property: 'og:title', content: 'Elysola' },
        {
          property: 'og:description',
          content: 'We build open-source software. Fair, transparent, and community-driven.',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://elysola.org' },

        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Elysola' },
        {
          name: 'twitter:description',
          content: 'We build open-source software. Fair, transparent, and community-driven.',
        },

      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/favicon.png' },
        { rel: 'stylesheet', href: '/fonts/maple/main.css' },
      ],

    },
  },
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'dark',
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxt/eslint',
    '@nuxtjs/color-mode',
    '@nuxtjs/sitemap',
    'nuxt-og-image',
  ],
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'zh', iso: 'zh-CN', file: 'zh-CN.json', name: '简体中文' },
    ],
    defaultLocale: 'zh',
    langDir: 'locales',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
  },
  ogImage: {
    zeroRuntime: true,
  },
  sitemap: {
    exclude: ['/api/**'],
  },

  devServer: {
    host: '0.0.0.0',
  },
  nitro: {
    preset: 'cloudflare-pages',
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/projects',
        '/team',
        '/partners',
        '/conduct',
        '/team/rhencloud',
        '/en',
        '/en/projects',
        '/en/team',
        '/en/partners',
        '/en/conduct',
        '/en/team/rhencloud',
        ...projectDefinitions.flatMap(({ slug }) => [`/projects/${slug}`, `/en/projects/${slug}`]),
      ],
    },
  },
  vite: {
    optimizeDeps: {
      include: ['marked'],
    },
  },

})
