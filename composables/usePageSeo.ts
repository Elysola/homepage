import { siteConfig } from '~/config/site'

interface PageSeoOptions {
  title: string
  description: string
  type?: 'website' | 'article' | 'profile'
  image?: string
  jsonLd?: Record<string, unknown>
}

export function usePageSeo({ title, description, type = 'website', image, jsonLd }: PageSeoOptions) {
  const route = useRoute()
  const { locale } = useI18n()
  const canonical = computed(() => new URL(route.path, 'https://elysola.org').toString())
  const ogImage = computed(() => image || 'https://elysola.org/_og/s/c_Default.takumi,title_Elysola.png')

  useHead(() => ({
    title,
    htmlAttrs: { lang: locale.value === 'en' ? 'en' : 'zh-CN' },
    link: [
      { rel: 'canonical', href: canonical.value },
      { rel: 'alternate', hreflang: 'zh-CN', href: `https://elysola.org${route.path.replace(/^\/en(?=\/|$)/, '') || '/'}` },
      { rel: 'alternate', hreflang: 'en', href: `https://elysola.org/en${route.path.replace(/^\/en/, '') || '/'}` },
    ],
    meta: [
      { name: 'description', content: description },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: type },
      { property: 'og:url', content: canonical.value },
      { property: 'og:site_name', content: siteConfig.title },
      { property: 'og:locale', content: locale.value === 'en' ? 'en_US' : 'zh_CN' },
      { property: 'og:locale:alternate', content: locale.value === 'en' ? 'zh_CN' : 'en_US' },
      { property: 'og:image', content: ogImage.value },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage.value },
      { name: 'twitter:site', content: '@ElysolaOrg' },
      { name: 'twitter:creator', content: '@ElysolaOrg' },
    ],
    script: jsonLd ? [{ type: 'application/ld+json', innerHTML: JSON.stringify(jsonLd) }] : [],
  }))
}
