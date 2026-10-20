import { expect, test, type Locator, type Page } from '@playwright/test'

test.describe('Network monitoring dashboard', () => {
  test('navigates from dashboard to node details and back', async ({ page }) => {
    await page.goto('/')

    await page
      .getByRole('link', {
        name: 'View metrics for Core Router',
      })
      .click()

    await expect(page).toHaveURL(/\/nodes\/core-router\?range=1h$/)
    await expect(
      page.getByRole('heading', {
        name: 'Core Router',
      }),
    ).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible()

    await page
      .getByRole('link', {
        name: 'Dashboard',
      })
      .click()

    await expect(page).toHaveURL(/\/$/)
    await expect(
      page.getByRole('heading', {
        name: 'Monitored nodes',
      }),
    ).toBeVisible()
  })

  test('loads a node detail route directly', async ({ page }) => {
    const routeWarnings: string[] = []
    page.on('console', (message) => {
      if (
        message.type() === 'warning' &&
        message.text().includes('No `HydrateFallback` element provided')
      ) {
        routeWarnings.push(message.text())
      }
    })

    await page.route('**/network-node-details-page.tsx*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 400))
      await route.continue()
    })

    await page.goto('/nodes/core-router')

    await expect(page.getByText('Loading node details...')).toBeVisible()
    await expect(
      page.getByRole('heading', {
        name: 'Core Router',
      }),
    ).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible()
    expect(routeWarnings).toHaveLength(0)
  })

  test('loads a node detail from its shared period URL and normalizes invalid periods', async ({
    page,
  }) => {
    for (const range of [
      { value: '1h', heading: 'Last hour performance (1h)' },
      { value: '24h', heading: 'Last 24 hours performance (24h)' },
      { value: '7d', heading: 'Last 7 days performance (7d)' },
    ]) {
      await page.goto(`/nodes/core-router?range=${range.value}`)

      await expect(page.getByRole('button', { name: range.value, exact: true })).toHaveAttribute(
        'aria-pressed',
        'true',
      )
      await expect(page.getByRole('heading', { name: range.heading })).toBeVisible()
      await expect(page).toHaveURL(new RegExp(`range=${range.value}`))
    }

    await page.goto('/nodes/core-router?debug=true&range=30d')
    await expect(page.getByRole('button', { name: '1h', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await expect(page).toHaveURL(/debug=true.*range=1h/)
  })

  test('replaces period history and copies a clean node link', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto('/')
    await page.getByRole('link', { name: 'View metrics for Core Router' }).click()
    await expect(page).toHaveURL(/\/nodes\/core-router\?range=1h/)

    await page.getByRole('button', { name: '24h', exact: true }).click()
    await expect(page).toHaveURL(/range=24h/)
    await page.getByRole('button', { name: '7d', exact: true }).click()
    await expect(page).toHaveURL(/range=7d/)

    await page.goBack()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole('heading', { name: 'Monitored nodes' })).toBeVisible()

    await page.goto('/nodes/core-router?range=24h&demo=slow&debug=true')
    await expect(page.getByRole('table')).toBeVisible()
    await page.getByRole('button', { name: 'Copy node link' }).click()
    await expect(page.getByRole('status')).toHaveText('Node link copied.')
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe(`${new URL(page.url()).origin}/nodes/core-router?range=24h`)
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

  test('keeps inventory controls and node fields visible across viewport sizes', async ({
    page,
  }) => {
    await page.goto('/')

    const search = page.getByRole('searchbox', { name: 'Search nodes' })
    const statusFilter = page.getByRole('combobox', { name: 'Filter by status' })
    const firstNode = page.getByRole('link', { name: 'View metrics for Core Router' })
    const nodeCard = firstNode.locator('article')

    await expect(search).toBeVisible()
    await expect(firstNode).toBeVisible()

    await nodeCard.locator('.network-node-card__eyebrow span').evaluate((element) => {
      element.textContent =
        'regionalnetworkgatewaynorthcampusoperationscenteridentifierwithoutbreaks'
    })
    await nodeCard.locator('.network-node-card__title').evaluate((element) => {
      element.textContent = 'RegionalNetworkGatewayOperationsCenterWithoutBreaks'
    })
    await nodeCard.locator('.network-node-card__detail code').evaluate((element) => {
      element.textContent = '2001:0db8:85a3:0000:0000:8a2e:0370:7334:2001:0db8'
    })
    await nodeCard
      .locator('.network-node-card__detail--location dd')
      .first()
      .evaluate((element) => {
        element.textContent = 'North Campus Regional Network Operations Center, Building 12'
      })

    for (const width of [320, 375, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 })

      await expect(search).toBeVisible()
      await expect(statusFilter).toBeVisible()
      await expect(nodeCard.locator('.network-node-card__title')).toBeVisible()
      await expect(nodeCard.getByText('Online')).toBeVisible()
      await expect(nodeCard.locator('.network-node-card__detail code')).toBeVisible()
      await expect(
        nodeCard.locator('.network-node-card__detail--location dd').first(),
      ).toBeVisible()
      await expect(nodeCard.getByText('Last checked')).toBeVisible()
      await expect(nodeCard.getByText('Open metrics')).toBeVisible()

      const dimensions = await page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      }))
      const cardOverflows = await nodeCard.evaluate(
        (element) => element.scrollWidth > element.clientWidth,
      )

      expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth)
      expect(cardOverflows).toBe(false)

      await firstNode.click()
      await expect(page.getByRole('heading', { name: 'Core Router' })).toBeVisible()
      await page.getByRole('link', { name: 'Dashboard' }).click()
      await expect(search).toBeVisible()
    }
  })

  test('keeps node detail controls and measurements usable across viewport sizes', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/nodes/core-router')

    const summary = page.getByLabel('Metrics summary')
    const rangeSelector = page.getByRole('group', { name: 'Metrics range' })
    const copyLinkButton = page.getByRole('button', { name: 'Copy node link' })
    const latencyChart = page.getByRole('figure', { name: /Latency trend for core-router/ })
    const packetLossChart = page.getByRole('figure', {
      name: /Packet loss trend for core-router/,
    })
    const peakLossAnnotation = page.getByRole('complementary', {
      name: 'Peak packet loss observation',
    })
    const table = page.getByRole('table')

    await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible()
    await expect(peakLossAnnotation).toBeVisible()
    await expect(summary).toBeVisible()
    await expect(rangeSelector).toBeVisible()
    await expect(rangeSelector.getByRole('button', { name: '1h', exact: true })).toBeVisible()
    await expect(copyLinkButton).toBeVisible()
    await expect(page.getByText('Simulated data')).toBeVisible()
    await expect(latencyChart.locator('svg')).toBeVisible()
    await expect(packetLossChart.locator('svg')).toBeVisible()
    await expect(table.locator('tbody tr')).toHaveCount(4)

    for (const viewport of [
      { width: 375, height: 812 },
      { width: 390, height: 844 },
      { width: 768, height: 900 },
      { width: 1024, height: 900 },
      { width: 1440, height: 900 },
    ]) {
      await page.setViewportSize(viewport)

      for (const locator of [
        page.getByRole('navigation', { name: 'Breadcrumb' }),
        summary,
        rangeSelector,
        copyLinkButton,
        page.getByText('Simulated data'),
        latencyChart,
        packetLossChart,
        peakLossAnnotation,
        table,
      ]) {
        await expect(locator).toBeVisible()

        const bounds = await locator.evaluate((element) => {
          const { left, right } = element.getBoundingClientRect()
          return { left, right }
        })

        expect(bounds.left).toBeGreaterThanOrEqual(0)
        expect(bounds.right).toBeLessThanOrEqual(viewport.width)
      }

      const chartLayout = await page.locator('.network-metrics__visuals').evaluate((element) => {
        const bounds = (selector: string) => {
          const rect = element.querySelector(selector)?.getBoundingClientRect()
          return rect
            ? { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom }
            : null
        }

        return {
          latency: bounds('.node-latency-chart'),
          packetLoss: bounds('.node-packet-loss-chart'),
          annotation: bounds('.network-metrics__annotation'),
        }
      })

      expect(chartLayout.latency).not.toBeNull()
      expect(chartLayout.packetLoss).not.toBeNull()
      expect(chartLayout.annotation).not.toBeNull()

      if (viewport.width > 860) {
        expect(chartLayout.packetLoss!.left).toBeGreaterThanOrEqual(chartLayout.latency!.right)
        expect(chartLayout.annotation!.left).toBeGreaterThanOrEqual(chartLayout.packetLoss!.left)
      } else {
        expect(chartLayout.packetLoss!.top).toBeGreaterThanOrEqual(chartLayout.latency!.bottom)
        expect(
          Math.abs(chartLayout.packetLoss!.left - chartLayout.latency!.left),
        ).toBeLessThanOrEqual(2)
        expect(chartLayout.annotation!.top).toBeGreaterThanOrEqual(chartLayout.packetLoss!.bottom)
      }

      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
        .toBeLessThanOrEqual(viewport.width)

      const dimensions = await page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        overflowCandidates: Array.from(document.querySelectorAll('body *'))
          .map((element) => {
            const bounds = element.getBoundingClientRect()
            return {
              tag: element.tagName.toLowerCase(),
              className: typeof element.className === 'string' ? element.className : '',
              left: Math.round(bounds.left),
              right: Math.round(bounds.right),
              width: Math.round(bounds.width),
              scrollWidth: element.scrollWidth,
            }
          })
          .filter((bounds) => bounds.left < -1 || bounds.right > window.innerWidth + 1)
          .sort((first, second) => second.right - first.right)
          .slice(0, 5),
      }))

      expect(
        dimensions.documentWidth,
        `Horizontal overflow candidates: ${JSON.stringify(dimensions.overflowCandidates)}`,
      ).toBeLessThanOrEqual(dimensions.viewportWidth)

      const dayRangeButton = rangeSelector.getByRole('button', { name: '24h', exact: true })
      await dayRangeButton.click()
      await expect(dayRangeButton).toHaveAttribute('aria-pressed', 'true')
      await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(25)
      const hourRangeButton = rangeSelector.getByRole('button', { name: '1h', exact: true })
      await hourRangeButton.click()
      await expect(hourRangeButton).toHaveAttribute('aria-pressed', 'true')
      await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(4)
    }
  })

  test('keeps seven-day chart labels separated across detail viewport sizes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/nodes/core-router')

    const rangeSelector = page.getByRole('group', { name: 'Metrics range' })
    await rangeSelector.getByRole('button', { name: '7d', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'Last 7 days performance (7d)' })).toBeVisible()

    const latencyChart = page.getByRole('figure', {
      name: 'Latency trend for core-router (ms, 7d, UTC)',
    })
    const packetLossChart = page.getByRole('figure', {
      name: 'Packet loss trend for core-router (percent, 7d, UTC)',
    })
    const charts = [latencyChart, packetLossChart]
    const widths = [375, 390, 768, 1024, 1440]

    for (const width of widths) {
      const viewport = { width, height: width < 640 ? 844 : 900 }
      await page.setViewportSize(viewport)

      await expect(latencyChart.locator('svg .recharts-dot.recharts-line-dot')).toHaveCount(29)

      for (const chart of charts) {
        const dateLabelBounds = await chart.locator('svg text').evaluateAll((elements) =>
          elements
            .filter((element) => /^[A-Z][a-z]{2} \d{1,2}$/.test(element.textContent?.trim() ?? ''))
            .map((element) => {
              const { left, right } = element.getBoundingClientRect()
              return { left, right }
            })
            .sort((first, second) => first.left - second.left),
        )

        expect(dateLabelBounds.length).toBeGreaterThan(1)
        dateLabelBounds.forEach((bounds, index) => {
          if (index > 0) {
            expect(bounds.left).toBeGreaterThanOrEqual(dateLabelBounds[index - 1].right)
          }
        })
      }

      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
        .toBeLessThanOrEqual(viewport.width)

      const dimensions = await page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        overflowCandidates: Array.from(document.querySelectorAll('body *'))
          .map((element) => {
            const bounds = element.getBoundingClientRect()
            return {
              tag: element.tagName.toLowerCase(),
              className: typeof element.className === 'string' ? element.className : '',
              left: Math.round(bounds.left),
              right: Math.round(bounds.right),
              width: Math.round(bounds.width),
              scrollWidth: element.scrollWidth,
            }
          })
          .filter((bounds) => bounds.left < -1 || bounds.right > window.innerWidth + 1)
          .sort((first, second) => second.right - first.right)
          .slice(0, 5),
      }))

      expect(
        dimensions.documentWidth,
        `Horizontal overflow candidates: ${JSON.stringify(dimensions.overflowCandidates)}`,
      ).toBeLessThanOrEqual(dimensions.viewportWidth)
      await expect(rangeSelector.getByRole('button', { name: '7d', exact: true })).toBeVisible()
      await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(29)
    }
  })

  test('wraps long node identifiers and names in the detail view', async ({ page }) => {
    await page.goto('/nodes/core-router')

    const longIdentifier =
      'regionalnetworkgatewaynorthcampusoperationscenteridentifierwithoutbreaks'
    const longName = 'RegionalNetworkGatewayOperationsCenterWithoutBreaks'
    const nodeIdentifier = page.locator('.app-header__node-id')
    const nodeHeading = page.locator('.app-header--detail h1')

    await nodeIdentifier.evaluate((element, value) => {
      element.textContent = value
    }, longIdentifier)
    await nodeHeading.evaluate((element, value) => {
      const textNode = element.firstChild

      if (textNode?.nodeType !== Node.TEXT_NODE) {
        throw new Error('Node heading is missing its name text')
      }

      textNode.textContent = value
    }, longName)

    for (const width of [375, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: width < 640 ? 844 : 900 })

      await expect(nodeIdentifier).toBeVisible()
      await expect(nodeHeading).toBeVisible()

      const headingOverflows = await nodeHeading.evaluate(
        (element) => element.scrollWidth > element.clientWidth,
      )
      const identifierOverflows = await nodeIdentifier.evaluate(
        (element) => element.scrollWidth > element.clientWidth,
      )

      expect(headingOverflows).toBe(false)
      expect(identifierOverflows).toBe(false)
    }

    await page.goto(`/nodes/${longIdentifier}`)
    await expect(page.getByRole('heading', { name: 'Node not found' })).toBeVisible()

    const notFoundMessage = page.locator(
      '.network-node-state > p:not(.network-node-state__eyebrow)',
    )
    for (const width of [375, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: width < 640 ? 844 : 900 })
      const textOverflows = await notFoundMessage.evaluate(
        (element) => element.scrollWidth > element.clientWidth,
      )

      expect(textOverflows).toBe(false)
    }
  })

  test('searches and filters nodes, including the no-results recovery state', async ({ page }) => {
    await page.goto('/')

    const search = page.getByRole('searchbox', { name: 'Search nodes' })
    const statusFilter = page.getByRole('combobox', { name: 'Filter by status' })

    await search.fill('Main office')
    await expect(page.getByRole('link', { name: 'View metrics for Core Router' })).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'View metrics for Access Switch 01' }),
    ).toBeVisible()
    await expect(page.getByRole('link', { name: 'View metrics for Branch Gateway' })).toHaveCount(0)

    await statusFilter.selectOption('degraded')
    await expect(
      page.getByRole('link', { name: 'View metrics for Access Switch 01' }),
    ).toBeVisible()
    await expect(page.getByText('Showing 1 of 3 nodes')).toBeVisible()

    await statusFilter.selectOption('offline')
    await expect(page.getByRole('heading', { name: 'No nodes match your filters' })).toBeVisible()
    await expect(page.getByText('Showing 0 of 3 nodes')).toBeVisible()

    await page.getByRole('button', { name: 'Clear filters' }).click()
    await expect(page.getByText('Showing 3 of 3 nodes')).toBeVisible()
    await expect(page.getByRole('link', { name: 'View metrics for Core Router' })).toBeVisible()

    const dimensions = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    }))
    expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth)
  })

  test('keeps fleet status counts independent of search and syncs keyboard filters on desktop', async ({
    page,
  }) => {
    test.skip(test.info().project.name === 'mobile-chromium', 'Desktop inventory acceptance')
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')

    const statusCounts = page.getByRole('group', { name: 'Fleet status counts' })
    const search = page.getByRole('searchbox', { name: 'Search nodes' })
    const statusFilter = page.getByRole('combobox', { name: 'Filter by status' })
    const fleetMetrics = page.getByRole('region', { name: 'Fleet metrics' })

    for (const status of ['Online', 'Degraded', 'Offline']) {
      await expect(statusCounts.getByRole('button', { name: `${status}, 1` })).toBeVisible()
    }
    await expect(fleetMetrics.getByText('Simulated data', { exact: true })).toBeVisible()
    await expect(fleetMetrics.getByText('65.5 ms', { exact: true })).toBeVisible()
    await expect(fleetMetrics.getByText('4.2%', { exact: true })).toBeVisible()
    await expect(fleetMetrics.getByText('3/3 nodes', { exact: true })).toBeVisible()

    await search.fill('Branch Gateway')
    await expect(page.getByText('Showing 1 of 3 nodes')).toBeVisible()
    await expect(page.getByRole('link', { name: 'View metrics for Branch Gateway' })).toBeVisible()
    for (const status of ['Online', 'Degraded', 'Offline']) {
      await expect(statusCounts.getByRole('button', { name: `${status}, 1` })).toBeVisible()
    }

    await search.clear()
    const onlineCount = statusCounts.getByRole('button', { name: 'Online, 1' })
    await onlineCount.focus()
    await expectVisibleKeyboardFocus(onlineCount)
    await page.keyboard.press('Enter')

    await expect(onlineCount).toHaveAttribute('aria-pressed', 'true')
    await expect(statusFilter).toHaveValue('online')
    await expect(page.getByText('Showing 1 of 3 nodes')).toBeVisible()
    await expect(page.getByRole('link', { name: 'View metrics for Core Router' })).toBeVisible()

    await statusFilter.selectOption('offline')
    await expect(statusCounts.getByRole('button', { name: 'Offline, 1' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await expect(page.getByRole('link', { name: 'View metrics for Branch Gateway' })).toBeVisible()

    await statusCounts.getByRole('button', { name: 'Offline, 1' }).click()
    await expect(statusFilter).toHaveValue('offline')
    await statusFilter.selectOption('all')
    await expect(page.getByText('Showing 3 of 3 nodes')).toBeVisible()
    await expect(statusCounts.getByRole('button', { name: 'Offline, 1' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
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
    const metricsSummary = page.getByLabel('Metrics summary')
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
      await expect(metricsSummary).toBeVisible()
      await expect(metricsSummary.getByText('Latest latency')).toBeVisible()
      await expect(metricsSummary.getByText('Average latency')).toBeVisible()
      await expect(metricsSummary.getByText('Peak packet loss')).toBeVisible()
      await expect(latencyChart.locator('svg')).toBeVisible()
      await expect(packetLossChart.locator('svg')).toBeVisible()

      const metricContentOrder = await page.locator('.network-metrics').evaluate((section) =>
        Array.from(section.children)
          .filter((element) =>
            element.matches(
              'dl.network-metrics__summary, .network-metrics__visuals, .network-metrics__table-wrapper',
            ),
          )
          .map((element) => {
            if (element.classList.contains('network-metrics__summary')) return 'summary'
            if (element.classList.contains('network-metrics__visuals')) return 'charts'
            return 'table'
          }),
      )

      expect(metricContentOrder).toEqual(['summary', 'charts', 'table'])
      const visualOrder = await page.locator('.network-metrics__visuals').evaluate((visuals) =>
        Array.from(visuals.querySelectorAll('figure, aside')).map((element) => {
          if (element.classList.contains('node-latency-chart')) return 'latency'
          if (element.classList.contains('node-packet-loss-chart')) return 'packet-loss'
          return 'annotation'
        }),
      )
      expect(visualOrder).toEqual(['latency', 'packet-loss', 'annotation'])
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

        expect(dateLabels.length).toBeGreaterThanOrEqual(6)
        expect(dateLabels.length).toBeLessThanOrEqual(8)
        expect(new Set(dateLabels).size).toBe(dateLabels.length)
        expect(timeLabels).toHaveLength(0)
        expect(dateLabelBounds).toHaveLength(dateLabels.length)
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

  test('provides subtle press feedback on metric range controls', async ({ page }) => {
    await page.goto('/nodes/core-router')

    const rangeButton = page.getByRole('button', { name: '24h', exact: true })
    await rangeButton.hover()
    await page.mouse.down()

    await expect
      .poll(() =>
        rangeButton.evaluate(
          (button) => new DOMMatrixReadOnly(getComputedStyle(button).transform).m42,
        ),
      )
      .toBe(1)
    await page.mouse.up()
  })

  test('keeps metric selection and content usable with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/nodes/core-router')

    const rangeSelector = page.getByRole('group', { name: 'Metrics range' })
    const rangeButton = rangeSelector.getByRole('button', { name: '24h', exact: true })

    await expect(page.getByText('Simulated data')).toBeVisible()
    await rangeButton.hover()
    await page.mouse.down()

    const motionStyles = await rangeButton.evaluate((button) => {
      const style = getComputedStyle(button)
      return {
        transitionDuration: style.transitionDuration,
        verticalOffset: new DOMMatrixReadOnly(style.transform).m42,
      }
    })
    const transitionMilliseconds = motionStyles.transitionDuration.split(',').map((duration) => {
      const value = Number.parseFloat(duration)
      return duration.trim().endsWith('ms') ? value : value * 1000
    })

    expect(Math.max(...transitionMilliseconds)).toBeLessThanOrEqual(0.01)
    expect(motionStyles.verticalOffset).toBe(0)
    await page.mouse.up()
    await rangeButton.click()

    await expect(rangeButton).toHaveAttribute('aria-pressed', 'true')
    await expect(
      page.getByRole('heading', { name: 'Last 24 hours performance (24h)' }),
    ).toBeVisible()
    await expect(page.getByRole('figure', { name: /Latency trend.*24h/ })).toBeVisible()
    await expect(page.getByRole('figure', { name: /Packet loss trend.*24h/ })).toBeVisible()
    await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(25)
  })

  test('reaches inventory actions and metric charts with visible keyboard focus', async ({
    page,
  }) => {
    await page.goto('/')

    const search = page.getByRole('searchbox', { name: 'Search nodes' })
    const statusFilter = page.getByRole('combobox', { name: 'Filter by status' })
    const coreRouterSelection = page.getByRole('checkbox', {
      name: 'Select Core Router for comparison',
    })
    const firstNode = page.getByRole('link', { name: 'View metrics for Core Router' })

    await expect(search).toBeVisible()
    await page.locator('body').click({ position: { x: 1, y: 1 } })
    await page.bringToFront()
    await page.keyboard.press('Tab')
    await expectVisibleKeyboardFocus(search)
    await page.keyboard.press('Tab')
    await expectVisibleKeyboardFocus(statusFilter)
    await page.keyboard.press('Tab')
    await expect(coreRouterSelection).toBeFocused()
    await page.keyboard.press('Tab')
    await expectVisibleKeyboardFocus(firstNode)
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/nodes\/core-router\?range=1h$/)

    await page.goto('/nodes/core-router')

    const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' })
    const breadcrumbLinks = [
      breadcrumb.getByRole('link', { name: 'Dashboard' }),
      breadcrumb.getByRole('link', { name: 'Monitored nodes' }),
    ]
    const rangeGroup = page.getByRole('group', { name: 'Metrics range' })
    const rangeButtons = ['1h', '24h', '7d'].map((range) =>
      rangeGroup.getByRole('button', { name: range, exact: true }),
    )
    const copyNodeLink = page.getByRole('button', { name: 'Copy node link' })
    const charts = [
      page
        .getByRole('figure', { name: 'Latency trend for core-router (ms, 1h, UTC)' })
        .locator('svg'),
      page
        .getByRole('figure', { name: 'Packet loss trend for core-router (percent, 1h, UTC)' })
        .locator('svg'),
    ]

    await expect(charts[1]).toBeVisible()
    await page.locator('body').click({ position: { x: 1, y: 1 } })
    await page.bringToFront()
    await page.keyboard.press('Tab')
    await expectVisibleKeyboardFocus(breadcrumbLinks[0])
    await page.keyboard.press('Tab')
    await expectVisibleKeyboardFocus(breadcrumbLinks[1])

    for (const control of [...rangeButtons, copyNodeLink, ...charts]) {
      await page.keyboard.press('Tab')
      await expectVisibleKeyboardFocus(control)
    }

    await expect(charts[0]).toHaveAttribute('role', 'application')
    await expect(charts[1]).toHaveAttribute('role', 'application')
    await expect(charts[0]).toHaveAccessibleName(
      'Latency trend for core-router in milliseconds, range 1h, UTC',
    )
    await expect(charts[1]).toHaveAccessibleName(
      'Packet loss trend for core-router in percent, range 1h, UTC',
    )
  })

  test('keeps comparison summaries synchronized across desktop and mobile ranges', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: (text: string) => {
            Object.assign(window, { comparisonClipboardText: text })
            return Promise.resolve()
          },
        },
      })
    })

    const viewports = [
      { width: 1440, height: 900 },
      { width: 390, height: 844 },
    ]
    const ranges = [
      { value: '1h', heading: 'Last hour comparison (1h)', pointsPerNode: 4 },
      { value: '24h', heading: 'Last 24 hours comparison (24h)', pointsPerNode: 25 },
      { value: '7d', heading: 'Last 7 days comparison (7d)', pointsPerNode: 29 },
    ] as const

    for (const viewport of viewports) {
      await page.setViewportSize(viewport)
      await page.goto('/compare?nodes=core-router%2Caccess-switch-01&demo=slow')

      const rangeSelector = page.getByRole('group', { name: 'Metrics range' })
      const summaries = page.getByRole('region', { name: 'Node metric summaries' })
      const initialRangeButton = rangeSelector.getByRole('button', { name: '1h', exact: true })

      await expect(page.getByRole('heading', { name: 'Compare nodes' })).toBeVisible()
      await expect(initialRangeButton).toHaveAttribute('aria-pressed', 'true')
      await expect(page).toHaveURL(/range=1h/)
      await expect(page.getByText('Simulated data', { exact: true })).toBeVisible()
      await expect(page.getByRole('table')).toBeVisible()
      await expectComparisonPeriod(page, ranges[0], viewport, summaries)

      await page.getByRole('button', { name: 'Copy comparison link' }).click()
      await expect(page.getByRole('status')).toHaveText('Comparison link copied.')
      const copiedUrl = await page.evaluate(
        () => (window as Window & { comparisonClipboardText?: string }).comparisonClipboardText,
      )
      expect(copiedUrl).toBe(
        `${new URL(page.url()).origin}/compare?nodes=core-router%2Caccess-switch-01&range=1h`,
      )

      for (const range of [ranges[1], ranges[2], ranges[0]]) {
        const rangeButton = rangeSelector.getByRole('button', {
          name: range.value,
          exact: true,
        })
        await rangeButton.click()

        await expect(rangeButton).toHaveAttribute('aria-pressed', 'true')
        await expect(page).toHaveURL(new RegExp(`range=${range.value}`))
        await expect(summaries).toHaveCount(0)
        await expect(page.getByRole('status', { name: /Loading metrics for/ })).toHaveCount(2)
        await expect(page.getByRole('table')).toHaveCount(0)
        await expect(page.getByRole('figure')).toHaveCount(0)
        await expect(page.getByRole('table')).toBeVisible()
        await expectComparisonPeriod(page, range, viewport, summaries)
      }
    }
  })

  test('normalizes direct comparison periods and replaces period history entries', async ({
    page,
  }) => {
    await page.goto('/compare?nodes=core-router%2Caccess-switch-01&range=7d')
    await expect(page.getByRole('button', { name: '7d', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await expect(page).toHaveURL(/range=7d/)

    await page.goto('/compare?nodes=core-router%2Caccess-switch-01&range=invalid')
    await expect(page.getByRole('button', { name: '1h', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await expect(page).toHaveURL(/range=1h/)

    await page.goto('/')
    await page.getByRole('checkbox', { name: 'Select Core Router for comparison' }).check()
    await page.getByRole('checkbox', { name: 'Select Access Switch 01 for comparison' }).check()
    await page.getByRole('button', { name: 'Compare selected nodes' }).click()
    await expect(page).toHaveURL(/\/compare\?.*range=1h/)

    await page.getByRole('button', { name: '24h', exact: true }).click()
    await expect(page).toHaveURL(/range=24h/)
    await page.getByRole('button', { name: '7d', exact: true }).click()
    await expect(page).toHaveURL(/range=7d/)

    await page.goBack()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole('heading', { name: 'Monitored nodes' })).toBeVisible()
  })

  test('allows keyboard selection of three nodes and fits the mobile viewport', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    const coreRouter = page.getByRole('checkbox', { name: 'Select Core Router for comparison' })
    const accessSwitch = page.getByRole('checkbox', {
      name: 'Select Access Switch 01 for comparison',
    })
    const branchGateway = page.getByRole('checkbox', {
      name: 'Select Branch Gateway for comparison',
    })

    await coreRouter.focus()
    await expectVisibleKeyboardFocus(coreRouter)
    await page.keyboard.press('Space')
    await expect(coreRouter).toBeChecked()
    await accessSwitch.focus()
    await expectVisibleKeyboardFocus(accessSwitch)
    await page.keyboard.press('Space')
    await expect(accessSwitch).toBeChecked()
    await branchGateway.focus()
    await expectVisibleKeyboardFocus(branchGateway)
    await page.keyboard.press('Space')
    await expect(branchGateway).toBeChecked()
    await expect(page.getByText('3 of 3 nodes selected for comparison')).toBeVisible()

    const selectionTransitions = await page
      .locator('.network-node-card__selection')
      .first()
      .evaluate((element) =>
        getComputedStyle(element)
          .transitionDuration.split(',')
          .map((duration) => Number.parseFloat(duration) * 1_000),
      )
    expect(selectionTransitions.every((duration) => duration <= 0.01)).toBe(true)

    await page.getByRole('button', { name: 'Compare selected nodes' }).click()

    await expect(page.getByRole('group', { name: 'Metrics range' })).toBeVisible()
    await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(12)
    await expect(page.getByText('Simulated data', { exact: true })).toBeVisible()
    await expect(page.getByRole('figure', { name: 'Latency by node (1h, ms)' })).toBeVisible()
    await expect(page.getByRole('figure', { name: 'Packet loss by node (1h, %)' })).toBeVisible()

    const comparisonLegends = await page
      .locator('.node-metrics-comparison-chart .recharts-legend-wrapper')
      .evaluateAll((elements) =>
        elements.map((element) =>
          Array.from(element.querySelectorAll('.recharts-legend-item-text'), (item) =>
            item.textContent?.trim(),
          ).sort(),
        ),
      )
    expect(comparisonLegends).toHaveLength(2)
    expect(comparisonLegends).toEqual([
      ['access-switch-01', 'branch-gateway', 'core-router'],
      ['access-switch-01', 'branch-gateway', 'core-router'],
    ])

    await page.locator('body').click({ position: { x: 1, y: 1 } })
    for (let tab = 0; tab < 3; tab += 1) {
      await page.keyboard.press('Tab')
    }

    const initialRangeButton = page
      .getByRole('group', { name: 'Metrics range' })
      .getByRole('button', { name: '1h', exact: true })
    await expectVisibleKeyboardFocus(initialRangeButton)

    const rangeButtonTransitions = await initialRangeButton.evaluate((element) =>
      getComputedStyle(element)
        .transitionDuration.split(',')
        .map((duration) => Number.parseFloat(duration) * 1_000),
    )
    expect(rangeButtonTransitions.every((duration) => duration <= 0.01)).toBe(true)

    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
      await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(12)

      const chartColumnCount = await page
        .locator('.node-metrics-comparison-chart')
        .evaluate(
          (element) =>
            getComputedStyle(element).gridTemplateColumns.split(/\s+/).filter(Boolean).length,
        )
      expect(chartColumnCount).toBe(width === 390 ? 1 : 2)

      const tableDimensions = await page.getByRole('table').evaluate((element) => ({
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
      }))
      expect(tableDimensions.scrollWidth).toBeLessThanOrEqual(tableDimensions.clientWidth)

      const dimensions = await page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      }))
      expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth)
    }
  })

  test('preserves valid node data beside missing and failed comparison nodes', async ({ page }) => {
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
      await page.goto('/compare?nodes=unknown-node,core-router')

      await expect(
        page.getByRole('heading', { name: 'Node not found: unknown-node' }),
      ).toBeVisible()
      const summaries = page.getByRole('region', { name: 'Node metric summaries' })
      await expect(summaries.getByRole('article')).toHaveCount(1)
      await expect(
        summaries.getByRole('article', { name: 'Core Router (core-router)' }),
      ).toBeVisible()
      await expect(summaries.getByRole('article', { name: 'unknown-node' })).toHaveCount(0)
      await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(4)
      await expect(page.getByRole('table').locator('tbody tr').first()).toContainText('core-router')
      await expect(page.getByText('Simulated data', { exact: true })).toBeVisible()

      let dimensions = await page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      }))
      expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth)

      await page.goto('/compare?nodes=core-router%2Caccess-switch-01&demo=error')

      await expect(page.getByRole('alert')).toHaveCount(2)
      await expect(page.getByRole('region', { name: 'Node metric summaries' })).toHaveCount(0)
      await expect(page.getByText('Simulated data', { exact: true })).toBeVisible()
      await expect(page.getByRole('table')).toHaveCount(0)
      await expect(page.getByRole('figure')).toHaveCount(0)

      dimensions = await page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      }))
      expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth)

      await page.goto('/compare?nodes=core-router%2Caccess-switch-01&demo=empty')
      const fallbackSummaries = page.getByRole('region', { name: 'Node metric summaries' })
      await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(8)
      await expect(fallbackSummaries.getByRole('article')).toHaveCount(2)
      await expect(fallbackSummaries.getByRole('article', { name: 'core-router' })).toBeVisible()
      await expect(
        fallbackSummaries.getByRole('article', { name: 'access-switch-01' }),
      ).toBeVisible()
      await expect(
        fallbackSummaries.getByRole('article', { name: 'Core Router (core-router)' }),
      ).toHaveCount(0)
    }
  })

  test('keeps loading identified and rejects invalid comparison selections', async ({ page }) => {
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
      await page.goto('/compare?nodes=core-router%2Caccess-switch-01&demo=slow')

      await expect(page.getByRole('group', { name: 'Metrics range' })).toBeVisible()
      await expect(page.getByText('Simulated data', { exact: true })).toBeVisible()
      await expect(page.getByRole('status', { name: /Loading metrics for/ })).toHaveCount(2)
      await expect(page.getByRole('table')).toHaveCount(0)

      const dimensions = await page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      }))
      expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth)
    }

    for (const selection of [
      'core-router',
      'core-router,core-router',
      'core-router,access-switch-01,branch-gateway,unknown-node',
    ]) {
      await page.goto(`/compare?nodes=${encodeURIComponent(selection)}`)
      await expect(
        page.getByRole('heading', { name: 'Select 2 or 3 nodes to compare' }),
      ).toBeVisible()
      await expect(page.getByRole('link', { name: 'Back to dashboard' })).toBeVisible()
      await expect(page.getByRole('table')).toHaveCount(0)
      await expect(page.getByRole('figure')).toHaveCount(0)
      await expect(page.getByRole('region', { name: 'Node metric summaries' })).toHaveCount(0)
    }
  })
})

async function expectVisibleKeyboardFocus(locator: Locator) {
  await expect(locator).toBeFocused()

  const focusIndicatorIsVisible = await locator.evaluate((element) => {
    const style = getComputedStyle(element)
    const hasOutline = style.outlineStyle !== 'none' && Number.parseFloat(style.outlineWidth) >= 2

    return hasOutline || style.boxShadow !== 'none' || style.borderColor === 'rgb(232, 176, 126)'
  })

  expect(focusIndicatorIsVisible).toBe(true)
}

async function expectComparisonPeriod(
  page: Page,
  range: { readonly value: string; readonly heading: string; readonly pointsPerNode: number },
  viewport: { readonly width: number; readonly height: number },
  summaries: Locator,
) {
  await expect(page.getByRole('heading', { name: range.heading })).toBeVisible()
  await expect(page.getByText('Simulated data', { exact: true })).toBeVisible()
  await expect(
    page.getByRole('figure', { name: `Latency by node (${range.value}, ms)` }),
  ).toBeVisible()
  await expect(
    page.getByRole('figure', { name: `Packet loss by node (${range.value}, %)` }),
  ).toBeVisible()

  const table = page.getByRole('table')
  await expect(table.locator('caption')).toHaveText(
    `Latency and packet loss measurements for selected nodes (${range.value})`,
  )
  await expect(table.locator('tbody tr')).toHaveCount(range.pointsPerNode * 2)
  await expect(table.locator('tbody time').first()).toHaveAttribute('datetime', /Z$/)

  await expect(summaries).toBeVisible()
  await expect(summaries.getByRole('article')).toHaveCount(2)
  const coreRouterSummary = summaries.getByRole('article', {
    name: 'Core Router (core-router)',
  })
  const accessSwitchSummary = summaries.getByRole('article', {
    name: 'Access Switch 01 (access-switch-01)',
  })
  await expect(coreRouterSummary).toBeVisible()
  await expect(accessSwitchSummary).toBeVisible()
  await expectSummaryMatchesTable(coreRouterSummary, table, 'core-router')
  await expectSummaryMatchesTable(accessSwitchSummary, table, 'access-switch-01')

  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }))
  expect(dimensions.documentWidth).toBeLessThanOrEqual(viewport.width)

  const cardBounds = await summaries.getByRole('article').evaluateAll((cards) =>
    cards.map((card) => {
      const { left, right } = card.getBoundingClientRect()
      return { left, right }
    }),
  )
  cardBounds.forEach(({ left, right }) => {
    expect(left).toBeGreaterThanOrEqual(0)
    expect(right).toBeLessThanOrEqual(viewport.width)
  })
}

async function expectSummaryMatchesTable(summary: Locator, table: Locator, nodeId: string) {
  const samples = await table.locator('tbody tr').evaluateAll((rows) =>
    rows.map((row) => {
      const cells = Array.from(row.querySelectorAll('td'), (cell) => cell.textContent?.trim() ?? '')

      return {
        nodeId: cells[0],
        timestamp: cells[1],
        latencyMs: Number.parseFloat(cells[2]),
        packetLossPercent: Number.parseFloat(cells[3]),
      }
    }),
  )
  const nodeSamples = samples.filter((sample) => sample.nodeId === nodeId)
  expect(nodeSamples.length).toBeGreaterThan(0)

  const latestSample = nodeSamples.reduce((latest, sample) =>
    Date.parse(sample.timestamp) > Date.parse(latest.timestamp) ? sample : latest,
  )
  const averageLatency =
    nodeSamples.reduce((total, sample) => total + sample.latencyMs, 0) / nodeSamples.length
  const peakPacketLoss = Math.max(...nodeSamples.map((sample) => sample.packetLossPercent))
  const formatMetric = (value: number) =>
    new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(value)

  await expect(summary.getByText('Latest latency')).toBeVisible()
  await expect(
    summary.getByText(`${formatMetric(latestSample.latencyMs)} ms`, { exact: true }),
  ).toBeVisible()
  await expect(summary.getByText('Average latency')).toBeVisible()
  await expect(
    summary.getByText(`${formatMetric(averageLatency)} ms`, { exact: true }),
  ).toBeVisible()
  await expect(summary.getByText('Peak packet loss')).toBeVisible()
  await expect(summary.getByText(`${formatMetric(peakPacketLoss)}%`, { exact: true })).toBeVisible()
}
