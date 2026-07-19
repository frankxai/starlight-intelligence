export type AgentRole = 'sovereign' | 'queen' | 'worker'

export type Agent = {
  id: string
  label: string
  role: AgentRole
  provider?: string
  model?: string
  permissions?: string[]
}

export type PolicyLock = {
  id: string
  label: string
  category: 'human-agency' | 'security' | 'budget' | 'data-boundary'
}

export type Team = {
  id: string
  name: string
  queen: Agent
  workers: Agent[]
}

export type HarnessManifest = {
  schema: 'starlight.harness/v1'
  id: string
  name: string
  mission: string
  owner: Agent
  approval: { required: boolean; threshold: 'routine' | 'high-impact' | 'irreversible' }
  policyLocks: PolicyLock[]
  teams: Team[]
  escalation: { owner: string; when: string[] }
  runtime?: { localPath?: string; sessionId?: string; host?: string }
}

export type TopologyNode = {
  id: string
  label: string
  kind: 'sovereign' | 'policy' | 'team' | 'queen' | 'worker'
}

export type TopologyEdge = { from: string; to: string; label: string }

export type Topology = { nodes: TopologyNode[]; edges: TopologyEdge[] }

export type ValidationResult = { valid: boolean; issues: string[] }

export function createHarness(draft: HarnessManifest): HarnessManifest {
  return JSON.parse(JSON.stringify(draft)) as HarnessManifest
}

export function validateHarness(harness: HarnessManifest): ValidationResult {
  const issues: string[] = []

  if (harness.schema !== 'starlight.harness/v1') issues.push('Unsupported harness schema.')
  if (!harness.id.trim() || !harness.name.trim()) issues.push('A harness needs a stable ID and name.')
  if (harness.owner.role !== 'sovereign') issues.push('A harness needs one sovereign owner.')
  if (!harness.mission.trim()) issues.push('A harness needs a stated mission.')
  if (!harness.approval.required) issues.push('A governed harness requires an approval gate.')
  if (!harness.policyLocks.length) issues.push('A harness needs at least one policy lock.')
  if (!harness.escalation.owner.trim()) issues.push('A harness needs a named human escalation owner.')
  if (!harness.escalation.when.length) issues.push('A harness needs explicit escalation conditions.')

  const teamIds = new Set<string>()
  for (const team of harness.teams) {
    if (teamIds.has(team.id)) issues.push('Team IDs must be unique.')
    teamIds.add(team.id)
    if (team.queen.role !== 'queen') issues.push(`Team ${team.name} needs a Queen.`)
    if (!team.workers.length) issues.push(`Team ${team.name} needs at least one worker.`)

    for (const worker of team.workers) {
      if (worker.role !== 'worker') issues.push(`Agent ${worker.label} must be a worker in this layer.`)
      if (!worker.permissions?.length || worker.permissions.includes('*')) {
        issues.push('Worker permissions must be bounded and explicit.')
      }
    }
  }

  return { valid: issues.length === 0, issues: [...new Set(issues)] }
}

export function buildTopology(harness: HarnessManifest): Topology {
  const nodes: TopologyNode[] = [
    { id: harness.owner.id, label: harness.owner.label, kind: 'sovereign' },
  ]
  const edges: TopologyEdge[] = []

  for (const lock of harness.policyLocks) {
    nodes.push({ id: lock.id, label: lock.label, kind: 'policy' })
    edges.push({ from: harness.owner.id, to: lock.id, label: 'sets' })
  }

  for (const team of harness.teams) {
    nodes.push({ id: team.id, label: team.name, kind: 'team' })
    nodes.push({ id: team.queen.id, label: team.queen.label, kind: 'queen' })
    edges.push({ from: harness.owner.id, to: team.queen.id, label: 'mandates' })
    edges.push({ from: team.queen.id, to: team.id, label: 'coordinates' })

    for (const worker of team.workers) {
      nodes.push({ id: worker.id, label: worker.label, kind: 'worker' })
      edges.push({ from: team.queen.id, to: worker.id, label: 'routes' })
      edges.push({ from: worker.id, to: team.id, label: 'returns receipt' })
    }
  }

  return { nodes, edges }
}

export function sanitizeHarnessForExport(harness: HarnessManifest): Omit<HarnessManifest, 'runtime'> {
  const { runtime: _runtime, ...portableHarness } = createHarness(harness)
  return portableHarness
}

export function parsePortableHarness(raw: string): HarnessManifest | ValidationResult {
  try {
    const candidate = JSON.parse(raw) as HarnessManifest
    const validation = validateHarness(candidate)
    return validation.valid ? candidate : validation
  } catch {
    return { valid: false, issues: ['The imported file is not valid JSON.'] }
  }
}
