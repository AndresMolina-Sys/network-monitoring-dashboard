import { expect, test } from '@playwright/test'

const apiUrl = 'http://127.0.0.1:5075'

test.describe('Full-stack integration', () => {
  test('loads node details from the ASP.NET Core API', async ({ page }) => {
    const nodeResponsePromise = page.waitForResponse(
      (response) =>
        response.url() === `${apiUrl}/api/nodes/core-router` &&
        response.request().method() === 'GET',
    )

    const metricsResponsePromise = page.waitForResponse(
      (response) =>
        response.url() === `${apiUrl}/api/nodes/core-router/metrics?range=1h` &&
        response.request().method() === 'GET',
    )

    await page.goto('/nodes/core-router')

    const nodeResponse = await nodeResponsePromise
    const metricsResponse = await metricsResponsePromise

    expect(nodeResponse.status()).toBe(200)
    expect(metricsResponse.status()).toBe(200)

    await expect(
      page.getByRole('heading', {
        name: 'Core Router',
      }),
    ).toBeVisible()

    await expect(
      page.getByRole('heading', {
        name: 'Last hour performance (1h)',
      }),
    ).toBeVisible()
  })

  test('renders the not-found state from an API 404', async ({ page }) => {
    const nodeResponsePromise = page.waitForResponse(
      (response) =>
        response.url() === `${apiUrl}/api/nodes/unknown-node` &&
        response.request().method() === 'GET',
    )

    await page.goto('/nodes/unknown-node')

    const nodeResponse = await nodeResponsePromise

    expect(nodeResponse.status()).toBe(404)

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
})
