import { describe, expect, it } from 'vitest'
import {
  buildTopology,
  createHarness,
  parsePortableHarness,
  sanitizeHarnessForExport,
  validateHarness,
  type HarnessManifest,
} from './harness'

const validHarness: HarnessManifest = {
  schema: 'starlight.harness/v1',
  id: 'atlas-team',
  name: 'Atlas Agentic Team',
  mission: 'Turn verified research into operator-approved execution plans.',
  owner: { id: 'frank', label: 'Sovereign operator', role: 'sovereign' },
  approval: { required: true, threshold: 'high-impact' },
  policyLocks: [
    { id: 'human-money', label: 'Human approves money and external commitments', category: 'human-agency' },
  ],
  teams: [
    {
      id: 'strategy',
      name: 'Strategy cell',
      queen: { id: 'queen-strategy', label: 'Strategy Queen', role: 'queen', provider: 'openai', model: 'gpt-5.6' },
      workers: [
        {
          id: 'researcher',
          label: 'Research worker',
          role: 'worker',
          provider: 'xai',
          model: 'grok-4.5',
          permissions: ['web.read', 'files.read'],
        },
      ],
    },
  ],
  escalation: { owner: 'frank', when: ['external-write', 'budget-change', 'policy-conflict'] },
  runtime: {
    localPath: 'C:/Users/frank/private/atlas',
    sessionId: 'private-session-123',
    host: 'FRANK-C940',
  },
}

describe('validateHarness', () => {
  it('accepts a governed harness with a sovereign, queen, worker limits, and escalation', () => {
    expect(validateHarness(validHarness)).toEqual({ valid: true, issues: [] })
  })

  it('rejects a harness without an explicit human escalation route', () => {
    const harness = createHarness({ ...validHarness, escalation: { owner: '', when: [] } })

    expect(validateHarness(harness)).toMatchObject({
      valid: false,
      issues: expect.arrayContaining(['A harness needs a named human escalation owner.']),
    })
  })

  it('rejects workers that can make unrestricted writes', () => {
    const harness = createHarness({
      ...validHarness,
      teams: [{ ...validHarness.teams[0], workers: [{ ...validHarness.teams[0].workers[0], permissions: ['*'] }] }],
    })

    expect(validateHarness(harness)).toMatchObject({
      valid: false,
      issues: expect.arrayContaining(['Worker permissions must be bounded and explicit.']),
    })
  })

  it('rejects unknown sensitive fields at the root and inside a worker', () => {
    const raw = JSON.stringify({
      ...sanitizeHarnessForExport(validHarness),
      credentials: { token: 'must-not-cross-the-boundary' },
      teams: [{
        ...validHarness.teams[0],
        workers: [{ ...validHarness.teams[0].workers[0], prompts: ['private prompt'] }],
      }],
    })

    expect(parsePortableHarness(raw)).toMatchObject({
      valid: false,
      issues: expect.arrayContaining(['The import contains fields outside the portable contract.']),
    })
  })

  it('rejects schema-invalid IDs before a harness reaches the workbench', () => {
    expect(parsePortableHarness(JSON.stringify({ ...sanitizeHarnessForExport(validHarness), id: 'Not a portable ID!' }))).toMatchObject({
      valid: false,
      issues: expect.arrayContaining(['A harness ID must use lowercase letters, numbers, and hyphens.']),
    })
  })

  it('rejects a portable harness with an invalid approval threshold', () => {
    expect(parsePortableHarness(JSON.stringify({ ...sanitizeHarnessForExport(validHarness), approval: { required: true, threshold: 'low-impact' } }))).toMatchObject({
      valid: false,
      issues: expect.arrayContaining(['A portable harness requires a valid approval threshold.']),
    })
  })

  it('rejects a portable harness with invalid policy locks', () => {
    expect(parsePortableHarness(JSON.stringify({ ...sanitizeHarnessForExport(validHarness), policyLocks: [{ id: '', label: 'Invalid lock', category: 'human-agency' }] }))).toMatchObject({
      valid: false,
      issues: expect.arrayContaining(['Policy locks must be named and classified.']),
    })
  })

  it('rejects a portable harness with invalid teams (e.g. no workers)', () => {
    expect(parsePortableHarness(JSON.stringify({ ...sanitizeHarnessForExport(validHarness), teams: [{ id: 'team-a', name: 'Team A', queen: validHarness.teams[0].queen, workers: [] }] }))).toMatchObject({
      valid: false,
      issues: expect.arrayContaining(['Every team needs a named Queen and workers with bounded permissions.']),
    })
  })

  it('rejects a portable harness with invalid escalation conditions', () => {
    expect(parsePortableHarness(JSON.stringify({ ...sanitizeHarnessForExport(validHarness), escalation: { owner: 'frank', when: [] } }))).toMatchObject({
      valid: false,
      issues: expect.arrayContaining(['A portable harness needs a named escalation owner and conditions.']),
    })
  })

  it('handles invalid JSON strings gracefully', () => {
    expect(parsePortableHarness('Not JSON at all')).toMatchObject({
      valid: false,
      issues: expect.arrayContaining(['The imported file is not valid JSON.']),
    })
  })

  it('rejects a portable harness that passes portable shape validation but fails logical validation', () => {
    // Duplicate team IDs passes portable shape validation, but fails harness validation.
    const harnessWithDuplicateTeams = {
      ...sanitizeHarnessForExport(validHarness),
      teams: [
        validHarness.teams[0],
        validHarness.teams[0]
      ]
    }
    expect(parsePortableHarness(JSON.stringify(harnessWithDuplicateTeams))).toMatchObject({
      valid: false,
      issues: expect.arrayContaining(['Team IDs must be unique.']),
    })
  })
})

describe('buildTopology', () => {
  it('projects policy locks, queen, team, and workers into inspectable nodes and edges', () => {
    const topology = buildTopology(validHarness)

    expect(topology.nodes.map((node) => node.id)).toEqual(
      expect.arrayContaining(['frank', 'human-money', 'queen-strategy', 'strategy', 'researcher']),
    )
    expect(topology.edges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ from: 'frank', to: 'human-money' }),
        expect.objectContaining({ from: 'queen-strategy', to: 'researcher' }),
      ]),
    )
  })
})

describe('sanitizeHarnessForExport', () => {
  it('constructs exports from an allowlist, even if an unsafe in-memory object is passed in', () => {
    const unsafeHarness = {
      ...validHarness,
      credentials: { token: 'must-not-export' },
      teams: [{
        ...validHarness.teams[0],
        workers: [{ ...validHarness.teams[0].workers[0], transcripts: ['must-not-export'] }],
      }],
    } as unknown as HarnessManifest
    const exported = sanitizeHarnessForExport(unsafeHarness)

    expect('runtime' in exported).toBe(false)
    expect(JSON.stringify(exported)).not.toContain('private-session-123')
    expect(JSON.stringify(exported)).not.toContain('must-not-export')
    expect(exported.id).toBe('atlas-team')
  })
})
