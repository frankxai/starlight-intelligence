import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App'
import { demoHarness } from './data/demoHarness'
import { sanitizeHarnessForExport } from './lib/harness'

describe('Starlight Pro workbench', () => {
  it('opens the Harness Builder and lets an operator change a high-impact approval threshold', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Harness Builder' }))

    expect(screen.getByRole('button', { name: 'Harness Builder' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Command Deck' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('heading', { name: 'Define the operating contract' })).toBeVisible()
    const threshold = screen.getByLabelText('Approval threshold')
    await user.selectOptions(threshold, 'irreversible')

    expect(threshold).toHaveValue('irreversible')
    expect(screen.getByText('Human review required before irreversible actions.')).toBeVisible()
  })

  it('exports a portable, sanitized manifest from the MCP Bridge', async () => {
    const user = userEvent.setup()
    const createObjectUrl = vi.fn(() => 'blob:starlight')
    Object.defineProperty(URL, 'createObjectURL', { value: createObjectUrl, writable: true })
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)

    render(<App />)
    await user.click(screen.getByRole('button', { name: 'MCP Bridge' }))
    await user.click(screen.getByRole('button', { name: 'Export portable manifest' }))

    expect(createObjectUrl).toHaveBeenCalledOnce()
    expect(click).toHaveBeenCalledOnce()
    click.mockRestore()
  })

  it('shows a clear error when an imported manifest is malformed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'MCP Bridge' }))

    const input = screen.getByLabelText('Import a portable manifest')
    const file = new File(['not-json'], 'broken.json', { type: 'application/json' })
    await user.upload(input, file)

    expect(await screen.findByRole('alert')).toHaveTextContent('The imported file is not valid JSON.')
  })

  it('rejects sensitive unknown import fields without mutating the active harness', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'MCP Bridge' }))

    const unsafeManifest = { ...sanitizeHarnessForExport(demoHarness), credentials: { token: 'never-import' } }
    const file = new File([JSON.stringify(unsafeManifest)], 'unsafe.json', { type: 'application/json' })
    await user.upload(screen.getByLabelText('Import a portable manifest'), file)

    expect(await screen.findByRole('alert')).toHaveTextContent('outside the portable contract')
    await user.click(screen.getByRole('button', { name: 'Harness Builder' }))
    expect(screen.getByLabelText('Harness name')).toHaveValue('Starlight Pro Operator Lab')
  })
})
