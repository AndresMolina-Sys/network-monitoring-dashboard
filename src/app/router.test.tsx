import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { AppRouter, ComparisonRouteFallback } from './router'

describe('AppRouter', () => {
  it('navigates from dashboard to node details', async () => {
    const user = userEvent.setup()

    render(<AppRouter />)

    expect(screen.getByText('Simulated inventory')).toBeVisible()
    expect(screen.queryByText('Live inventory')).not.toBeInTheDocument()

    const nodeLink = await screen.findByRole(
      'link',
      {
        name: 'View metrics for Core Router',
      },
      {
        timeout: 5000,
      },
    )

    await user.click(nodeLink)

    await waitFor(
      () => {
        expect(window.location.pathname).toBe('/nodes/core-router')
      },
      {
        timeout: 5000,
      },
    )

    expect(
      await screen.findByRole(
        'heading',
        {
          name: /Core Router/,
        },
        {
          timeout: 5000,
        },
      ),
    ).toBeInTheDocument()
  })

  it('loads only the node IDs selected in the comparison URL', async () => {
    renderComparisonUrl('/compare?nodes=access-switch-01%2Cbranch-gateway')

    const table = await screen.findByRole('table')
    const rows = within(table).getAllByRole('row').slice(1)

    expect(screen.getByRole('heading', { name: 'Compare nodes' })).toBeVisible()
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.every((row) => /access-switch-01|branch-gateway/.test(row.textContent ?? ''))).toBe(
      true,
    )
    expect(rows.some((row) => row.textContent?.includes('access-switch-01'))).toBe(true)
    expect(rows.some((row) => row.textContent?.includes('branch-gateway'))).toBe(true)
    expect(rows.some((row) => row.textContent?.includes('core-router'))).toBe(false)
  })

  it.each([
    '/compare',
    '/compare?nodes=core-router',
    '/compare?nodes=core-router%2Caccess-switch-01%2Cbranch-gateway%2Cextra-node',
    '/compare?nodes=core-router%2Ccore-router',
    '/compare?nodes=core-router%2C%2Caccess-switch-01',
  ])('rejects an insufficient or invalid comparison URL: %s', async (initialEntry) => {
    renderComparisonUrl(initialEntry)

    expect(
      await screen.findByRole('heading', { name: 'Select 2 or 3 nodes to compare' }),
    ).toBeVisible()
    expect(screen.getByRole('link', { name: 'Back to dashboard' })).toHaveAttribute('href', '/')
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.queryByRole('region', { name: /comparison charts/i })).not.toBeInTheDocument()
  })

  it('keeps an unknown selected node distinct while showing the valid node results', async () => {
    renderComparisonUrl('/compare?nodes=unknown-node%2Ccore-router')

    const table = await screen.findByRole('table')
    const rows = within(table).getAllByRole('row').slice(1)

    expect(await screen.findByRole('status')).toHaveTextContent('Node not found: unknown-node')
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.every((row) => row.textContent?.includes('core-router'))).toBe(true)
    expect(screen.getByRole('region', { name: /comparison charts for 1h/i })).toBeVisible()
  })

  it('defines an accessible loading fallback for the lazy comparison route', () => {
    render(<ComparisonRouteFallback />)

    expect(screen.getByRole('status', { name: 'Loading node comparison' })).toHaveAttribute(
      'aria-busy',
      'true',
    )
    expect(screen.getByText('Simulated data')).toBeVisible()
  })
})

function renderComparisonUrl(initialEntry: string) {
  const rendered = render(<AppRouter />)

  act(() => {
    window.history.pushState({}, '', initialEntry)
    window.dispatchEvent(new PopStateEvent('popstate'))
  })

  return rendered
}
