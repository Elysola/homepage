import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const pages = ['/', '/projects', '/team', '/partners', '/conduct', '/en']

for (const path of pages) {
  test(`${path} renders with page landmarks and SEO`, async ({ page }) => {
    await page.goto(path)
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /elysola\.org/)
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/_og\/.+\.png/)
  })
}

test('mobile navigation opens and closes with Escape', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile navigation is covered by the mobile project.')
  await page.setViewportSize({ width: 320, height: 720 })
  await page.goto('/en', { waitUntil: 'networkidle' })

  const menu = page.getByRole('button', { name: 'Toggle navigation menu' })
  await menu.click()
  await expect(page.locator('#mobile-nav')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.locator('#mobile-nav')).toBeHidden()
  await expect(menu).toBeFocused()
})

test('language switcher navigates to English', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'The language selector is inside the mobile menu.')
  await page.goto('/')
  await page.getByRole('combobox', { name: 'Switch language' }).selectOption('en')
  await expect(page).toHaveURL(/\/en\/?$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})

test('dark mode remains readable', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  await expect(page.locator('body')).toBeVisible()
  await expect(page.locator('main')).toBeVisible()
})

test('homepage visual baseline', async ({ page }) => {
  test.skip(!process.env.VISUAL_REGRESSION, 'Set VISUAL_REGRESSION=true to run screenshot baselines')
  await page.goto('/')
  await expect(page).toHaveScreenshot('homepage.png', { fullPage: true, animations: 'disabled' })
})

test('mobile menu visual baseline', async ({ page }) => {
  test.skip(!process.env.VISUAL_REGRESSION, 'Set VISUAL_REGRESSION=true to run screenshot baselines')
  await page.setViewportSize({ width: 320, height: 720 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Toggle navigation menu' }).click()
  await expect(page).toHaveScreenshot('homepage-mobile-menu.png', { fullPage: true, animations: 'disabled' })
})

test('main pages have no critical accessibility violations', async ({ page }) => {
  for (const path of ['/en', '/en/projects', '/en/team', '/en/conduct']) {
    await page.goto(path)
    const results = await new AxeBuilder({ page }).analyze()
    const critical = results.violations.filter((violation) => violation.impact === 'critical')
    expect(critical, `${path} has critical accessibility violations`).toEqual([])
  }
})
