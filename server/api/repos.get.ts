import { siteConfig } from '../../config/site'
import { fallbackProjects, type ProjectRecord } from '../../config/projects'

interface GitHubRepo {
  name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  topics: string[]
  homepage: string | null
  fork: boolean
}

type RepoResponse = ProjectRecord

let inFlight: Promise<RepoResponse[]> | undefined

async function fetchRepos(): Promise<RepoResponse[]> {
  const org = 'Elysola'
  const allowed = new Set(siteConfig.repos)
  const url = `https://api.github.com/orgs/${encodeURIComponent(org)}/repos?per_page=100&sort=updated`
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8_000)

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Elysola/1.0',
        Accept: 'application/vnd.github+json',
      },
    })
    if (!res.ok) throw new Error(`GitHub returned ${res.status}`)
    const repos: GitHubRepo[] = await res.json()

    return repos
      .filter((r) => allowed.has(r.name) && !r.fork)
      .map((r) => ({
        name: r.name,
        description: r.description ?? '',
        url: r.html_url,
        language: r.language ?? '',
        stars: r.stargazers_count,
        topics: r.topics ?? [],
        homepage: r.homepage ?? '',
      }))
      .sort((a, b) => b.stars - a.stars)
  } finally {
    clearTimeout(timeout)
  }
}

export default defineEventHandler(async (event) => {
  try {
    inFlight ??= fetchRepos()
    const data = await inFlight
    inFlight = undefined
    setResponseHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400')
    setResponseHeader(event, 'CDN-Cache-Control', 'public, max-age=3600')
    return data
  } catch {
    inFlight = undefined
    setResponseHeader(event, 'X-Elysola-Data', 'static-fallback')
    setResponseHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=3600')
    return fallbackProjects
  }
})
