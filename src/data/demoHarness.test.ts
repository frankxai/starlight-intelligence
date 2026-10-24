import { describe, expect, it } from 'vitest'
import { demoHarness } from './demoHarness'
import { validateHarness, buildTopology } from '../lib/harness'

describe('demoHarness', () => {
  it('is a valid Starlight Pro harness', () => {
    const result = validateHarness(demoHarness)
    expect(result).toEqual({ valid: true, issues: [] })
  })

  it('builds a topology containing all demo actors and constraints', () => {
    const topology = buildTopology(demoHarness)

    const sovereignNodes = topology.nodes.filter((n) => n.kind === 'sovereign')
    expect(sovereignNodes).toHaveLength(1)
    expect(sovereignNodes[0].id).toBe('sovereign')

    const policyNodes = topology.nodes.filter((n) => n.kind === 'policy')
    expect(policyNodes).toHaveLength(3)
    expect(policyNodes.map((n) => n.id)).toContain('budget-lock')

    const teamNodes = topology.nodes.filter((n) => n.kind === 'team')
    expect(teamNodes).toHaveLength(2)

    const queenNodes = topology.nodes.filter((n) => n.kind === 'queen')
    expect(queenNodes).toHaveLength(2)

    const workerNodes = topology.nodes.filter((n) => n.kind === 'worker')
    expect(workerNodes).toHaveLength(4)
  })

  it('contains expected local runtime state', () => {
    expect(demoHarness.runtime).toBeDefined()
    expect(demoHarness.runtime?.host).toBe('LOCAL-MACHINE')
  })
})
