export default defineEventHandler(async (event) => {
  const { username } = getRouterParams(event)
  if (!username || typeof username !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Missing username' })
  }
  const url = `https://github.com/${encodeURIComponent(username)}.png?size=200`
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'Elysola/1.0' },
    })
    if (!res.ok) throw new Error(`GitHub returned ${res.status}`)
    for (const [key, value] of res.headers.entries()) {
      if (key.toLowerCase() === 'content-type') {
        setResponseHeader(event, 'Content-Type', value)
      }
    }
    setResponseHeader(event, 'Cache-Control', 'public, max-age=86400, s-maxage=604800')
    setResponseHeader(event, 'CDN-Cache-Control', 'public, max-age=604800')
    return sendStream(event, res.body!)
  } catch (err) {
    throw createError({ statusCode: 502, statusMessage: `Failed to fetch avatar: ${err}` })
  }
})
