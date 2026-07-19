import type { HarnessManifest } from '../lib/harness'

export const demoHarness: HarnessManifest = {
  schema: 'starlight.harness/v1',
  id: 'starlight-pro-operator-lab',
  name: 'Starlight Pro Operator Lab',
  mission: 'Turn real operator intent into governed, reviewable agentic work.',
  owner: {
    id: 'sovereign',
    label: 'Sovereign operator',
    role: 'sovereign',
  },
  approval: { required: true, threshold: 'high-impact' },
  policyLocks: [
    { id: 'agency-lock', label: 'Human approval for commitments', category: 'human-agency' },
    { id: 'privacy-lock', label: 'No private vaults in public outputs', category: 'data-boundary' },
    { id: 'budget-lock', label: 'Bounded model and tool budgets', category: 'budget' },
  ],
  teams: [
    {
      id: 'strategy-cell',
      name: 'Strategy cell',
      queen: { id: 'strategy-queen', label: 'Strategy Queen', role: 'queen', provider: 'OpenAI', model: 'GPT-5.6' },
      workers: [
        { id: 'signal-scout', label: 'Signal Scout', role: 'worker', provider: 'xAI', model: 'Grok 4.5', permissions: ['web.read', 'files.read'] },
        { id: 'proof-verifier', label: 'Proof Verifier', role: 'worker', provider: 'Gemini', model: 'Gemini 3.5', permissions: ['files.read', 'eval.run'] },
      ],
    },
    {
      id: 'build-cell',
      name: 'Build cell',
      queen: { id: 'build-queen', label: 'Build Queen', role: 'queen', provider: 'Anthropic', model: 'Claude Sonnet' },
      workers: [
        { id: 'implementation-worker', label: 'Implementation Worker', role: 'worker', provider: 'OpenAI', model: 'GPT-5.6', permissions: ['files.read', 'files.write:scoped', 'tests.run'] },
        { id: 'sentinel-worker', label: 'Sentinel', role: 'worker', provider: 'xAI', model: 'Grok 4.5', permissions: ['files.read', 'diff.review', 'security.scan'] },
      ],
    },
  ],
  escalation: {
    owner: 'Sovereign operator',
    when: ['external-write', 'budget-change', 'policy-conflict', 'irreversible-action'],
  },
  runtime: {
    localPath: 'C:/private/starlight/operator-lab',
    sessionId: 'local-only-demo-session',
    host: 'LOCAL-MACHINE',
  },
}
