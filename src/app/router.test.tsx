import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { AppRouter } from './router'

describe('AppRouter', () => {
  it('navigates from dashboard to node details', async () => {
    const user = userEvent.setup()

    render(<AppRouter />)

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
          name: 'Node details',
        },
        {
          timeout: 5000,
        },
      ),
    ).toBeInTheDocument()
  })
})
