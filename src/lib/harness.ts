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

export type PortableHarnessManifest = Omit<HarnessManifest, 'runtime'>

export type TopologyNode = {
  id: string
  label: string
  kind: 'sovereign' | 'policy' | 'team' | 'queen' | 'worker'
}

export type TopologyEdge = { from: string; to: string; label: string }
export type Topology = { nodes: TopologyNode[]; edges: TopologyEdge[] }
export type ValidationResult = { valid: boolean; issues: string[] }

type JsonRecord = Record<string, unknown>

const rootKeys = ['schema', 'id', 'name', 'mission', 'owner', 'approval', 'policyLocks', 'teams', 'escalation']
const agentKeys = ['id', 'label', 'role', 'provider', 'model', 'permissions']
const teamKeys = ['id', 'name', 'queen', 'workers']
const policyKeys = ['id', 'label', 'category']
const approvalKeys = ['required', 'threshold']
const escalationKeys = ['owner', 'when']
const validCategories = new Set<PolicyLock['category']>(['human-agency', 'security', 'budget', 'data-boundary'])
const validThresholds = new Set<HarnessManifest['approval']['threshold']>(['routine', 'high-impact', 'irreversible'])
const idPattern = /^[a-z0-9][a-z0-9-]{1,63}$/

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
  const nodes: TopologyNode[] = [{ id: harness.owner.id, label: harness.owner.label, kind: 'sovereign' }]
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

function portableAgent(agent: Agent): Agent {
  const portable: Agent = { id: agent.id, label: agent.label, role: agent.role }
  if (typeof agent.provider === 'string') portable.provider = agent.provider
  if (typeof agent.model === 'string') portable.model = agent.model
  if (Array.isArray(agent.permissions)) portable.permissions = agent.permissions.filter((permission): permission is string => typeof permission === 'string')
  return portable
}

/** Builds a portable object from an allowlist; never strips fields by omission alone. */
export function sanitizeHarnessForExport(harness: HarnessManifest): PortableHarnessManifest {
  return {
    schema: 'starlight.harness/v1',
    id: harness.id,
    name: harness.name,
    mission: harness.mission,
    owner: portableAgent(harness.owner),
    approval: { required: harness.approval.required, threshold: harness.approval.threshold },
    policyLocks: harness.policyLocks.map((lock) => ({ id: lock.id, label: lock.label, category: lock.category })),
    teams: harness.teams.map((team) => ({
      id: team.id,
      name: team.name,
      queen: portableAgent(team.queen),
      workers: team.workers.map(portableAgent),
    })),
    escalation: { owner: harness.escalation.owner, when: [...harness.escalation.when] },
  }
}

function asRecord(value: unknown): JsonRecord | undefined {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? value as JsonRecord : undefined
}

function onlyHasKeys(value: JsonRecord, allowed: string[]): boolean {
  return Object.keys(value).every((key) => allowed.includes(key))
}

function isNonEmptyString(value: unknown, max = 1000): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= max
}

function hasUnknownFields(value: unknown): boolean {
  const root = asRecord(value)
  if (!root || !onlyHasKeys(root, rootKeys)) return true

  const owner = asRecord(root.owner)
  const approval = asRecord(root.approval)
  const escalation = asRecord(root.escalation)
  if (!owner || !onlyHasKeys(owner, agentKeys) || !approval || !onlyHasKeys(approval, approvalKeys) || !escalation || !onlyHasKeys(escalation, escalationKeys)) return true
  if (!Array.isArray(root.policyLocks) || !Array.isArray(root.teams)) return true

  for (const lock of root.policyLocks) {
    const policy = asRecord(lock)
    if (!policy || !onlyHasKeys(policy, policyKeys)) return true
  }

  for (const teamValue of root.teams) {
    const team = asRecord(teamValue)
    if (!team || !onlyHasKeys(team, teamKeys)) return true
    const queen = asRecord(team.queen)
    if (!queen || !onlyHasKeys(queen, agentKeys) || !Array.isArray(team.workers)) return true
    for (const worker of team.workers) {
      const agent = asRecord(worker)
      if (!agent || !onlyHasKeys(agent, agentKeys)) return true
    }
  }

  return false
}

function isAgent(value: unknown, role: AgentRole, worker = false): value is Agent {
  const agent = asRecord(value)
  if (!agent || !isNonEmptyString(agent.id, 64) || !isNonEmptyString(agent.label, 120) || agent.role !== role) return false
  if (agent.provider !== undefined && !isNonEmptyString(agent.provider, 120)) return false
  if (agent.model !== undefined && !isNonEmptyString(agent.model, 120)) return false
  if (agent.permissions !== undefined && (!Array.isArray(agent.permissions) || agent.permissions.some((permission) => !isNonEmptyString(permission, 120) || permission === '*'))) return false
  return !worker || Array.isArray(agent.permissions) && agent.permissions.length > 0
}

function validatePortableShape(value: unknown): ValidationResult {
  if (hasUnknownFields(value)) return { valid: false, issues: ['The import contains fields outside the portable contract.'] }
  const harness = value as JsonRecord
  const issues: string[] = []

  if (harness.schema !== 'starlight.harness/v1') issues.push('Unsupported harness schema.')
  if (typeof harness.id !== 'string' || !idPattern.test(harness.id)) issues.push('A harness ID must use lowercase letters, numbers, and hyphens.')
  if (!isNonEmptyString(harness.name, 120)) issues.push('A harness name must be between 2 and 120 characters.')
  if (!isNonEmptyString(harness.mission, 1000) || harness.mission.trim().length < 10) issues.push('A harness mission must be between 10 and 1000 characters.')
  if (!isAgent(harness.owner, 'sovereign')) issues.push('The portable owner must be a sovereign agent.')

  const approval = harness.approval as JsonRecord
  if (approval.required !== true || typeof approval.threshold !== 'string' || !validThresholds.has(approval.threshold as HarnessManifest['approval']['threshold'])) {
    issues.push('A portable harness requires a valid approval threshold.')
  }

  const policies = harness.policyLocks as unknown[]
  if (!policies.length || policies.some((lock) => {
    const policy = lock as JsonRecord
    return !isNonEmptyString(policy.id, 64) || !isNonEmptyString(policy.label, 160) || typeof policy.category !== 'string' || !validCategories.has(policy.category as PolicyLock['category'])
  })) issues.push('Policy locks must be named and classified.')

  const teams = harness.teams as unknown[]
  if (!teams.length || teams.some((teamValue) => {
    const team = teamValue as JsonRecord
    return !isNonEmptyString(team.id, 64) || !isNonEmptyString(team.name, 120) || !isAgent(team.queen, 'queen') || !Array.isArray(team.workers) || !team.workers.length || team.workers.some((worker) => !isAgent(worker, 'worker', true))
  })) issues.push('Every team needs a named Queen and workers with bounded permissions.')

  const escalation = harness.escalation as JsonRecord
  if (!isNonEmptyString(escalation.owner, 120) || !Array.isArray(escalation.when) || !escalation.when.length || escalation.when.some((item) => !isNonEmptyString(item, 120))) {
    issues.push('A portable harness needs a named escalation owner and conditions.')
  }

  return { valid: issues.length === 0, issues }
}

export function parsePortableHarness(raw: string): HarnessManifest | ValidationResult {
  try {
    const candidate: unknown = JSON.parse(raw)
    const shape = validatePortableShape(candidate)
    if (!shape.valid) return shape
    const portable = candidate as PortableHarnessManifest
    const validation = validateHarness(portable)
    return validation.valid ? sanitizeHarnessForExport(portable) : validation
  } catch {
    return { valid: false, issues: ['The imported file is not valid JSON.'] }
  }
}
