import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'
import { memberSocials } from '~/config/members'

export interface MemberLocalized {
  slug: string
  name: string
  role: string
  motto: string
  bio: string
  github?: string
  twitter?: string
  website?: string
  matrix?: string
  discord?: string
  telegram?: string
  bilibili?: string
  email?: string
}

function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return { data: {} as Record<string, string>, content: raw }

  const data: Record<string, string> = {}
  for (const line of match[1]!.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const sep = trimmed.indexOf(':')
    if (sep === -1) continue
    let value = trimmed.slice(sep + 1).trim()
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
    if (value) data[trimmed.slice(0, sep).trim()] = value
  }

  return { data, content: match[2]! }
}

function loadMembers(lang: string) {
  const files = import.meta.glob('/content/{en,zh}/team/*.md', {
    eager: true,
    query: '?raw',
    import: 'default',
  }) as Record<string, string>

  const prefix = `/content/${lang}/team/`
  return Object.entries(files)
    .filter(([path]) => path.startsWith(prefix))
    .map(([path, raw]) => {
      const { data, content } = parseFrontmatter(raw)
      const slug = data.slug || path.replace(prefix, '').replace('.md', '')
      return {
        slug,
        name: data.name || slug,
        role: data.role || '',
        motto: data.motto || '',
        bio: DOMPurify.sanitize(marked.parse(content || '') as string, {
          ALLOWED_TAGS: ['a', 'blockquote', 'br', 'code', 'em', 'h1', 'h2', 'h3', 'h4', 'hr', 'li', 'ol', 'p', 'pre', 'strong', 'ul'],
          ALLOWED_ATTR: ['href', 'rel', 'target'],
        }).replaceAll('<a ', '<a target="_blank" rel="noopener noreferrer" '),
        ...(memberSocials[slug] ?? {}),
      }
    })
}

function getMembersForLocale(locale: string) {
  const lang = locale.startsWith('zh') ? 'zh' : 'en'
  return loadMembers(lang)
}

export function useMembers() {
  const { locale } = useI18n()
  const members = computed(() => getMembersForLocale(locale.value))
  return { members }
}

export function useMember(slug: string, localeOverride?: string) {
  const { locale } = useI18n()
  const member = computed(() => {
    const lang = (localeOverride ?? locale.value).startsWith('zh') ? 'zh' : 'en'
    return getMembersForLocale(lang).find((m) => m.slug === slug) ?? null
  })
  return { member }
}
