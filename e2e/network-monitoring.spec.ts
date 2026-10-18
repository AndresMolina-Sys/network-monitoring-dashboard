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

  test('shows complete metric ranges without horizontal overflow', async ({ page }) => {
    const projectName = test.info().project.name
    const viewport =
      projectName === 'mobile-chromium' ? { width: 390, height: 844 } : { width: 1440, height: 900 }

    await page.setViewportSize(viewport)
    expect(page.viewportSize()).toEqual(viewport)

    await page.goto('/nodes/core-router')

    const ranges = [
      { value: '1h', heading: 'Last hour performance (1h)', samples: 4 },
      { value: '24h', heading: 'Last 24 hours performance (24h)', samples: 25 },
      { value: '7d', heading: 'Last 7 days performance (7d)', samples: 29 },
    ]
    const rangeSelector = page.getByRole('group', { name: 'Metrics range' })
    const table = page.getByRole('table')

    for (const range of ranges) {
      const latencyChart = page.getByRole('figure', {
        name: `Latency trend for core-router (ms, ${range.value}, UTC)`,
      })
      const packetLossChart = page.getByRole('figure', {
        name: `Packet loss trend for core-router (percent, ${range.value}, UTC)`,
      })

      await rangeSelector.getByRole('button', { name: range.value, exact: true }).click()

      await expect(
        rangeSelector.getByRole('button', { name: range.value, exact: true }),
      ).toHaveAttribute('aria-pressed', 'true')
      await expect(page.getByText('Simulated data')).toBeVisible()
      await expect(page.getByRole('heading', { name: range.heading })).toBeVisible()
      await expect(latencyChart.locator('svg')).toBeVisible()
      await expect(packetLossChart.locator('svg')).toBeVisible()

      const metricContentOrder = await page.locator('.network-metrics').evaluate((section) =>
        Array.from(section.children)
          .filter((element) => element.matches('figure, .network-metrics__table-wrapper'))
          .map((element) => {
            if (element.classList.contains('node-latency-chart')) return 'latency'
            if (element.classList.contains('node-packet-loss-chart')) return 'packet-loss'
            return 'table'
          }),
      )

      expect(metricContentOrder).toEqual(['latency', 'packet-loss', 'table'])
      await expect(latencyChart.locator('svg .recharts-dot.recharts-line-dot')).toHaveCount(
        range.samples,
      )
      await expect(packetLossChart.locator('svg .recharts-dot.recharts-line-dot')).toHaveCount(
        range.samples,
      )
      await expect(table.locator('caption')).toHaveText(
        `Full data for both charts: latency and packet loss measurements for core-router (${range.value})`,
      )
      await expect(table.locator('thead th')).toHaveText(['Timestamp', 'Latency', 'Packet loss'])
      await expect(table.locator('tbody tr')).toHaveCount(range.samples)

      if (range.value === '7d') {
        const chartLabels = (await latencyChart.locator('svg text').allTextContents()).map(
          (label) => label.trim(),
        )
        const dateLabels = chartLabels.filter((label) => /^[A-Z][a-z]{2} \d{1,2}$/.test(label))
        const timeLabels = chartLabels.filter((label) => /^\d{2}:\d{2}$/.test(label))
        const dateLabelBounds = await latencyChart.locator('svg text').evaluateAll((elements) =>
          elements
            .filter((element) => /^[A-Z][a-z]{2} \d{1,2}$/.test(element.textContent?.trim() ?? ''))
            .map((element) => {
              const { left, right } = element.getBoundingClientRect()
              return { left, right }
            })
            .sort((first, second) => first.left - second.left),
        )
        const chartBounds = await latencyChart.evaluate((element) => {
          const { left, right } = element.getBoundingClientRect()
          return { left, right }
        })

        expect(dateLabels).toHaveLength(8)
        expect(new Set(dateLabels).size).toBe(dateLabels.length)
        expect(timeLabels).toHaveLength(0)
        expect(dateLabelBounds).toHaveLength(8)
        dateLabelBounds.forEach((bounds, index) => {
          expect(bounds.left).toBeGreaterThanOrEqual(chartBounds.left)
          expect(bounds.right).toBeLessThanOrEqual(chartBounds.right)

          if (index > 0) {
            expect(bounds.left).toBeGreaterThanOrEqual(dateLabelBounds[index - 1].right)
          }
        })
      }

      const dimensions = await page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      }))

      expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth)
    }
  })
})
