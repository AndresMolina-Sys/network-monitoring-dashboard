import { expect, test, type Locator } from '@playwright/test'

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
    await expect(page).toHaveURL(/\/nodes\/core-router$/)

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

    for (const control of [...rangeButtons, ...charts]) {
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

  test('compares two selected nodes across every range without stale rows', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')

    const coreRouter = page.getByRole('checkbox', { name: 'Select Core Router for comparison' })
    const accessSwitch = page.getByRole('checkbox', {
      name: 'Select Access Switch 01 for comparison',
    })
    const branchGateway = page.getByRole('checkbox', {
      name: 'Select Branch Gateway for comparison',
    })

    await coreRouter.check()
    await accessSwitch.check()
    await expect(page.getByText('2 of 3 nodes selected for comparison')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Compare selected nodes' })).toBeEnabled()
    await page.getByRole('button', { name: 'Compare selected nodes' }).click()

    await expect(page).toHaveURL(/\/compare\?nodes=core-router%2Caccess-switch-01$/)
    await expect(page.getByRole('heading', { name: 'Compare nodes' })).toBeVisible()
    await expect(page.getByText('Simulated data', { exact: true })).toBeVisible()
    await expect(branchGateway).toHaveCount(0)

    const ranges = [
      { value: '1h', heading: 'Last hour comparison (1h)', pointsPerNode: 4 },
      { value: '24h', heading: 'Last 24 hours comparison (24h)', pointsPerNode: 25 },
      { value: '7d', heading: 'Last 7 days comparison (7d)', pointsPerNode: 29 },
    ]
    const rangeSelector = page.getByRole('group', { name: 'Metrics range' })
    const expectedNodeIds = ['core-router', 'access-switch-01'].sort()

    for (const range of ranges) {
      const rangeButton = rangeSelector.getByRole('button', { name: range.value, exact: true })
      await rangeButton.click()

      await expect(rangeButton).toHaveAttribute('aria-pressed', 'true')
      await expect(page.getByRole('heading', { name: range.heading })).toBeVisible()
      await expect(page.getByText('Simulated data', { exact: true })).toBeVisible()
      await expect(
        page.getByRole('figure', { name: `Latency by node (${range.value}, ms)` }),
      ).toBeVisible()
      await expect(
        page.getByRole('figure', { name: `Packet loss by node (${range.value}, %)` }),
      ).toBeVisible()

      const table = page.getByRole('table')
      await expect(table).toBeVisible()
      await expect(table.locator('caption')).toHaveText(
        `Latency and packet loss measurements for selected nodes (${range.value})`,
      )
      await expect(table.locator('thead th')).toHaveText([
        'Node',
        'Timestamp',
        'Latency',
        'Packet loss',
      ])
      await expect(table.locator('tbody tr')).toHaveCount(range.pointsPerNode * 2)
      await expect
        .poll(() =>
          table
            .locator('tbody tr td:first-child')
            .allTextContents()
            .then((nodeIds) => [...new Set(nodeIds)].sort()),
        )
        .toEqual(expectedNodeIds)
      await expect(table.locator('tbody time').first()).toHaveAttribute('datetime', /Z$/)

      const dimensions = await page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      }))
      expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth)
    }
  })

  test('allows keyboard selection of three nodes and fits the mobile viewport', async ({
    page,
  }) => {
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
    await expect(coreRouter).toBeFocused()
    await page.keyboard.press('Space')
    await expect(coreRouter).toBeChecked()
    await accessSwitch.focus()
    await expect(accessSwitch).toBeFocused()
    await page.keyboard.press('Space')
    await expect(accessSwitch).toBeChecked()
    await branchGateway.focus()
    await expect(branchGateway).toBeFocused()
    await page.keyboard.press('Space')
    await expect(branchGateway).toBeChecked()
    await expect(page.getByText('3 of 3 nodes selected for comparison')).toBeVisible()
    await page.getByRole('button', { name: 'Compare selected nodes' }).click()

    await expect(page.getByRole('group', { name: 'Metrics range' })).toBeVisible()
    await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(12)
    await expect(page.getByText('Simulated data', { exact: true })).toBeVisible()
    await expect(page.getByRole('figure', { name: 'Latency by node (1h, ms)' })).toBeVisible()
    await expect(page.getByRole('figure', { name: 'Packet loss by node (1h, %)' })).toBeVisible()

    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
      await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(12)

      const dimensions = await page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      }))
      expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth)
    }
  })

  test('preserves valid node data beside missing and failed comparison nodes', async ({ page }) => {
    await page.goto('/compare?nodes=unknown-node,core-router')

    await expect(page.getByRole('heading', { name: 'Node not found: unknown-node' })).toBeVisible()
    await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(4)
    await expect(page.getByRole('table').locator('tbody tr').first()).toContainText('core-router')
    await expect(page.getByText('Simulated data', { exact: true })).toBeVisible()

    await page.goto('/compare?nodes=core-router%2Caccess-switch-01&demo=error')

    await expect(page.getByRole('alert')).toHaveCount(2)
    await expect(page.getByText('Simulated data', { exact: true })).toBeVisible()
    await expect(page.getByRole('table')).toHaveCount(0)
    await expect(page.getByRole('figure')).toHaveCount(0)
  })

  test('keeps loading identified and rejects invalid comparison selections', async ({ page }) => {
    await page.goto('/compare?nodes=core-router%2Caccess-switch-01&demo=slow')

    await expect(page.getByRole('group', { name: 'Metrics range' })).toBeVisible()
    await expect(page.getByText('Simulated data', { exact: true })).toBeVisible()
    await expect(page.getByRole('status', { name: /Loading metrics for/ })).toHaveCount(2)
    await expect(page.getByRole('table')).toHaveCount(0)

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
