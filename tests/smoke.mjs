import assert from 'node:assert/strict'

const base = process.env.BASE_URL || 'http://127.0.0.1:3000'
const routes = ['/', '/projects', '/team', '/team/rhencloud', '/partners', '/conduct', '/en', '/en/projects']

for (const route of routes) {
  const response = await fetch(`${base}${route}`)
  assert.equal(response.status, 200, `${route} should return 200`)
  const html = await response.text()
  assert.match(html, /<main[\s>]/, `${route} should render a main landmark`)
  assert.match(html, /canonical|og:title/, `${route} should include SEO metadata`)
}

const projects = await fetch(`${base}/api/repos`)
assert.ok([200, 502].includes(projects.status), 'repo endpoint should return a controlled response')
if (projects.ok) {
  const payload = await projects.json()
  assert.ok(Array.isArray(payload), 'repo endpoint should return an array')
}

console.log(`Smoke checks passed for ${routes.length} routes`)
