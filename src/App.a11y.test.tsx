import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axe from 'axe-core'
import { describe, expect, it } from 'vitest'
import App from './App'

async function expectNoStructuralViolations() {
  const result = await axe.run(document, {
    rules: {
      'color-contrast': { enabled: false },
    },
  })
  expect(result.violations).toEqual([])
}

describe('accessibility audit', () => {
  it('has no structural axe violations on the command deck', async () => {
    render(<App />)
    await expectNoStructuralViolations()
  })

  it('has no structural axe violations across interactive workbench views', async () => {
    const user = userEvent.setup()
    render(<App />)

    for (const view of ['Harness Builder', 'Swarm Canvas', 'Agentic Teams', 'MCP Bridge']) {
      await user.click(screen.getByRole('button', { name: view }))
      await expectNoStructuralViolations()
    }
  })
})
