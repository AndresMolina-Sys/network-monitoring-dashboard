import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { AppRouter } from './router'

describe('AppRouter', () => {
  it('navigates from dashboard to node details', async () => {
    const user = userEvent.setup()

    render(<AppRouter />)

    await user.click(
      await screen.findByRole('link', {
        name: 'View metrics for Core Router',
      }),
    )

    expect(
      await screen.findByRole('heading', {
        name: 'Node details',
      }),
    ).toBeInTheDocument()

    expect(window.location.pathname).toBe('/nodes/core-router')
  })
})
