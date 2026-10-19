import { createElement } from 'react'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { NodeMetrics } from '../../../domain/network'
import { NodeMetricsComparisonChart } from './node-metrics-comparison-chart'

const CORE_ROUTER_METRICS: NodeMetrics = {
  nodeId: 'core-router',
  range: '1h',
  points: [
    { timestamp: '2026-10-18T11:00:00Z', latencyMs: 18, packetLossPercent: 0 },
    { timestamp: '2026-10-18T12:00:00Z', latencyMs: 20, packetLossPercent: 0.2 },
  ],
}

const ACCESS_SWITCH_METRICS: NodeMetrics = {
  nodeId: 'access-switch-01',
  range: '1h',
  points: [
    { timestamp: '2026-10-19T14:00:00Z', latencyMs: 24, packetLossPercent: 0.4 },
    { timestamp: '2026-10-19T15:00:00Z', latencyMs: 27, packetLossPercent: 0.6 },
  ],
}

class FixedResizeObserver {
  private readonly callback: ResizeObserverCallback

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
  }

  observe(target: Element) {
    this.callback(
      [{ target, contentRect: new DOMRect(0, 0, 800, 280) } as ResizeObserverEntry],
      this as unknown as ResizeObserver,
    )
  }

  unobserve() {}

  disconnect() {}
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', FixedResizeObserver)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('node metrics comparison chart data', () => {
  it('aligns node measurements by elapsed time and exposes their original UTC samples', async () => {
    render(
      createElement(NodeMetricsComparisonChart, {
        metrics: [CORE_ROUTER_METRICS, ACCESS_SWITCH_METRICS],
        range: '1h',
      }),
    )

    const latencyFigure = screen.getByRole('figure', { name: 'Latency by node (1h, ms)' })
    const packetLossFigure = screen.getByRole('figure', { name: 'Packet loss by node (1h, %)' })
    const latencySurface = within(latencyFigure).getByRole('application', {
      name: 'Latency by node in milliseconds, range 1h',
    })
    const packetLossSurface = within(packetLossFigure).getByRole('application', {
      name: 'Packet loss by node in percent, range 1h',
    })

    latencySurface.focus()
    await waitFor(() => {
      const tooltipText =
        latencyFigure.querySelector('.node-metrics-comparison-chart__tooltip')?.textContent ?? ''

      expect(tooltipText).toContain('2026-10-18T11:00:00Z')
      expect(tooltipText).toContain('2026-10-19T14:00:00Z')
      expect(tooltipText).toContain('18 ms')
      expect(tooltipText).toContain('24 ms')
    })

    fireEvent.keyDown(latencySurface, { key: 'ArrowRight' })
    await waitFor(() => {
      const tooltipText =
        latencyFigure.querySelector('.node-metrics-comparison-chart__tooltip')?.textContent ?? ''

      expect(tooltipText).toContain('2026-10-18T12:00:00Z')
      expect(tooltipText).toContain('2026-10-19T15:00:00Z')
      expect(tooltipText).toContain('20 ms')
      expect(tooltipText).toContain('27 ms')
    })

    packetLossSurface.focus()
    await waitFor(() => {
      const tooltipText =
        packetLossFigure.querySelector('.node-metrics-comparison-chart__tooltip')?.textContent ?? ''

      expect(tooltipText).toContain('2026-10-18T11:00:00Z')
      expect(tooltipText).toContain('2026-10-19T14:00:00Z')
      expect(tooltipText).toContain('0%')
      expect(tooltipText).toContain('0.4%')
    })
  })
})
