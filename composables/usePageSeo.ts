import { siteConfig } from '~/config/site'

interface PageSeoOptions {
  title: MaybeRef<string>
  description: MaybeRef<string>
  type?: 'website' | 'article' | 'profile'
  image?: MaybeRef<string | undefined>
  jsonLd?: MaybeRef<Record<string, unknown> | undefined>
}

const siteUrl = 'https://elysola.org'

function normalizePath(path: string) {
  if (path === '/') return '/'
  return `/${path.replace(/^\/+|\/+$/g, '')}`
}

export function usePageSeo({ title, description, type = 'website', image, jsonLd }: PageSeoOptions) {
  const route = useRoute()
  const { locale } = useI18n()
  const localizedPath = computed(() => normalizePath(route.path.replace(/^\/en(?=\/|$)/, '') || '/'))
  const canonicalPath = computed(() => normalizePath(route.path))
  const canonical = computed(() => `${siteUrl}${canonicalPath.value}`)
  const zhUrl = computed(() => `${siteUrl}${localizedPath.value}`)
  const enUrl = computed(() => `${siteUrl}/en${localizedPath.value === '/' ? '' : localizedPath.value}`)
  const pageTitle = computed(() => {
    const value = toValue(title)
    return value === siteConfig.title || value.includes(siteConfig.title) ? value : `${value} | ${siteConfig.title}`
  })
  const ogImage = computed(() => toValue(image) || `${siteUrl}/_og/s/c_Default.takumi,title_Elysola.png`)

  useHead(() => ({
    title: pageTitle.value,
    htmlAttrs: { lang: locale.value === 'en' ? 'en' : 'zh-CN' },
    link: [
      { rel: 'canonical', href: canonical.value },
      { rel: 'alternate', hreflang: 'zh-CN', href: zhUrl.value },
      { rel: 'alternate', hreflang: 'en', href: enUrl.value },
      { rel: 'alternate', hreflang: 'x-default', href: zhUrl.value },
    ],
    meta: [
      { name: 'description', content: toValue(description) },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: pageTitle.value },
      { property: 'og:description', content: toValue(description) },
      { property: 'og:type', content: type },
      { property: 'og:url', content: canonical.value },
      { property: 'og:site_name', content: siteConfig.title },
      { property: 'og:locale', content: locale.value === 'en' ? 'en_US' : 'zh_CN' },
      { property: 'og:locale:alternate', content: locale.value === 'en' ? 'zh_CN' : 'en_US' },
      { property: 'og:image', content: ogImage.value },
      { property: 'og:image:alt', content: pageTitle.value },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: pageTitle.value },
      { name: 'twitter:description', content: toValue(description) },
      { name: 'twitter:image', content: ogImage.value },
      { name: 'twitter:site', content: '@ElysolaOrg' },
      { name: 'twitter:creator', content: '@ElysolaOrg' },
    ],
    script: toValue(jsonLd) ? [{ type: 'application/ld+json', innerHTML: JSON.stringify(toValue(jsonLd)) }] : [],
  }))
}
