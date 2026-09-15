import { expect, test } from '@playwright/test'

test.describe('Network monitoring dashboard', () => {
  test('navigates from dashboard to node details and back', async ({ page }) => {
    await page.goto('/')

    await page
      .getByRole('link', {
        name: 'View metrics for Core Router',
      })
      .click()

    await expect(page).toHaveURL(/\/nodes\/core-router$/)
    await expect(
      page.getByRole('heading', {
        name: 'Node details',
      }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', {
        name: 'Core Router',
      }),
    ).toBeVisible()

    await page
      .getByRole('link', {
        name: 'Back to dashboard',
      })
      .click()

    await expect(page).toHaveURL(/\/$/)
    await expect(
      page.getByRole('heading', {
        name: 'Network Monitoring Dashboard',
      }),
    ).toBeVisible()
  })

  test('loads a node detail route directly', async ({ page }) => {
    await page.goto('/nodes/core-router')

    await expect(
      page.getByRole('heading', {
        name: 'Node details',
      }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', {
        name: 'Core Router',
      }),
    ).toBeVisible()
  })

  test('shows a not-found state for an unknown node', async ({ page }) => {
    await page.goto('/nodes/unknown-node')

    await expect(
      page.getByRole('heading', {
        name: 'Node not found',
      }),
    ).toBeVisible()
    await expect(
      page.getByRole('button', {
        name: 'Try again',
      }),
    ).toHaveCount(0)
  })

  test('does not overflow horizontally on a mobile viewport', async ({ page }) => {
    await page.goto('/')

    const dimensions = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    }))

    expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth)
  })
})
