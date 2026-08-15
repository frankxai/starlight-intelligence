import { useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import './App.css'
import { demoHarness } from './data/demoHarness'
import {
  buildTopology,
  parsePortableHarness,
  sanitizeHarnessForExport,
  validateHarness,
  type HarnessManifest,
  type TopologyNode,
  type ValidationResult,
} from './lib/harness'

type View = 'overview' | 'builder' | 'canvas' | 'teams' | 'mcp'

const navigation: Array<{ id: View; label: string; eyebrow: string }> = [
  { id: 'overview', label: 'Command Deck', eyebrow: '01 / posture' },
  { id: 'builder', label: 'Harness Builder', eyebrow: '02 / contract' },
  { id: 'canvas', label: 'Swarm Canvas', eyebrow: '03 / topology' },
  { id: 'teams', label: 'Agentic Teams', eyebrow: '04 / roles' },
  { id: 'mcp', label: 'MCP Bridge', eyebrow: '05 / connection' },
]

function isValidationResult(value: HarnessManifest | ValidationResult): value is ValidationResult {
  return 'valid' in value
}

function nodeGlyph(kind: TopologyNode['kind']) {
  return { sovereign: 'S', policy: '◇', queen: 'Q', team: 'T', worker: 'W' }[kind]
}

function App() {
  const [activeView, setActiveView] = useState<View>('overview')
  const [harness, setHarness] = useState<HarnessManifest>(demoHarness)
  const [importError, setImportError] = useState<string>('')
  const [notice, setNotice] = useState<string>('')

  const topology = useMemo(() => buildTopology(harness), [harness])
  const validation = useMemo(() => validateHarness(harness), [harness])
  const agentCount = harness.teams.reduce((total, team) => total + team.workers.length + 1, 0)

  const updateHarness = <K extends keyof HarnessManifest>(key: K, value: HarnessManifest[K]) => {
    setHarness((current) => ({ ...current, [key]: value }))
    setNotice('')
  }

  const exportManifest = () => {
    const portable = sanitizeHarnessForExport(harness)
    const blob = new Blob([JSON.stringify(portable, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${portable.id || 'starlight-harness'}.json`
    anchor.click()
    URL.revokeObjectURL(url)
    setNotice('Portable manifest prepared. It contains no runtime paths, sessions, prompts, or credentials.')
  }

  const importManifest = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const parsed = parsePortableHarness(String(reader.result ?? ''))
      if (isValidationResult(parsed)) {
        setImportError(parsed.issues[0] ?? 'The imported manifest did not pass validation.')
        return
      }
      setHarness(parsed)
      setImportError('')
      setNotice('Portable harness loaded locally. Review the contract before connecting any runtime.')
    }
    reader.onerror = () => setImportError('The selected file could not be read locally.')
    reader.readAsText(file)
    event.target.value = ''
  }

  return (
    <main className="app-shell">
      <a className="skip-link" href="#workspace">Skip to workspace</a>
      <aside className="rail" aria-label="Starlight navigation">
        <div className="brand-mark" aria-label="Starlight Pro">
          <span aria-hidden="true">✦</span>
          <span>Starlight</span>
          <small>Pro / operator OS</small>
        </div>
        <nav className="primary-nav" aria-label="Workbench views">
          {navigation.map((item) => (
            <button
              aria-label={item.label}
              aria-pressed={activeView === item.id}
              className={activeView === item.id ? 'nav-item active' : 'nav-item'}
              key={item.id}
              onClick={() => setActiveView(item.id)}
              type="button"
            >
              <span className="nav-index">{item.eyebrow}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="rail-footer">
          <span className="status-dot" aria-hidden="true" />
          Local blueprint mode
        </div>
      </aside>

      <section className="workspace" id="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">{navigation.find((item) => item.id === activeView)?.eyebrow}</p>
            <p className="context-line">{harness.name} <span>•</span> governed locally</p>
          </div>
          <div className="topbar-actions">
            <span className={validation.valid ? 'verification-pill pass' : 'verification-pill'}>
              {validation.valid ? 'Contract coherent' : 'Needs attention'}
            </span>
            <button className="button ghost" type="button" onClick={() => setActiveView('mcp')}>Portable manifest</button>
          </div>
        </header>

        {activeView === 'overview' && (
          <section className="view overview-view" aria-labelledby="overview-heading">
            <div className="hero-copy">
              <p className="eyebrow">Starlight Pro</p>
              <h1 id="overview-heading">A calm command surface for an agentic team that stays <em>yours.</em></h1>
              <p className="lede">Define the contract before the swarm. Map authority, bound capabilities, route work through Queens, and retain the human decision where it matters.</p>
              <div className="hero-actions">
                <button className="button primary" onClick={() => setActiveView('builder')} type="button">Define the harness <span aria-hidden="true">→</span></button>
                <button className="button text" onClick={() => setActiveView('canvas')} type="button">Inspect the swarm</button>
              </div>
            </div>
            <div className="signal-panel" aria-label="Current blueprint summary">
              <div className="signal-label">Current posture</div>
              <div className="signal-word">GOVERNED</div>
              <div className="signal-rule" />
              <dl>
                <div><dt>Owner</dt><dd>{harness.owner.label}</dd></div>
                <div><dt>Escalation</dt><dd>{harness.escalation.owner}</dd></div>
                <div><dt>Runtime</dt><dd>Not connected</dd></div>
              </dl>
              <p>Blueprint mode never runs agents, reads private vaults, or transmits your harness data away.</p>
            </div>
            <section className="metric-strip" aria-label="Blueprint metrics">
              <article><span>01</span><strong>{harness.teams.length}</strong><p>agentic teams</p></article>
              <article><span>02</span><strong>{agentCount}</strong><p>defined agents</p></article>
              <article><span>03</span><strong>{harness.policyLocks.length}</strong><p>policy locks</p></article>
              <article><span>04</span><strong>1</strong><p>human decision path</p></article>
            </section>
            <section className="principle-grid" aria-label="Starlight principles">
              <article><p className="eyebrow">Sovereignty</p><h2>The operator owns the context.</h2><p>Exportable contracts, local-first posture, and no hidden hosted memory claim.</p></article>
              <article><p className="eyebrow">Governance</p><h2>Capability is explicit, never implied.</h2><p>Workers receive narrow permissions; important work returns with a receipt.</p></article>
              <article><p className="eyebrow">Evidence</p><h2>Execution earns trust.</h2><p>Model routing, review gates, and output verification are designed before scale.</p></article>
            </section>
          </section>
        )}

        {activeView === 'builder' && (
          <section className="view builder-view" aria-labelledby="builder-heading">
            <div className="section-heading"><p className="eyebrow">Harness Builder</p><h1 id="builder-heading">Define the operating contract</h1><p>Start with a bounded mission and a human decision path. This browser-local workbench exports a portable blueprint, not a live runtime.</p></div>
            <div className="builder-layout">
              <form className="contract-form" onSubmit={(event) => event.preventDefault()}>
                <label>Harness name<input value={harness.name} onChange={(event) => updateHarness('name', event.target.value)} /></label>
                <label>Mission<textarea rows={4} value={harness.mission} onChange={(event) => updateHarness('mission', event.target.value)} /></label>
                <label>Approval threshold
                  <select aria-label="Approval threshold" value={harness.approval.threshold} onChange={(event) => updateHarness('approval', { ...harness.approval, threshold: event.target.value as HarnessManifest['approval']['threshold'] })}>
                    <option value="routine">Routine — sampled review</option>
                    <option value="high-impact">High impact — explicit operator review</option>
                    <option value="irreversible">Irreversible — operator decision required</option>
                  </select>
                </label>
                <p className="field-note">{harness.approval.threshold === 'irreversible' ? 'Human review required before irreversible actions.' : harness.approval.threshold === 'high-impact' ? 'Human review required for external, budget, or policy-impacting actions.' : 'Routine work is still bounded by policy locks and receipts.'}</p>
                <label>Escalation owner<input value={harness.escalation.owner} onChange={(event) => updateHarness('escalation', { ...harness.escalation, owner: event.target.value })} /></label>
              </form>
              <aside className="governance-checklist" aria-label="Governance checklist">
                <p className="eyebrow">Contract check</p>
                <h2>{validation.valid ? 'Ready for a human review' : 'Resolve these boundaries first'}</h2>
                <ul>
                  {(validation.valid ? ['One sovereign owner', 'Approval is explicit', 'Workers have bounded permissions', 'Escalation is named'] : validation.issues).map((item) => <li key={item}>{item}</li>)}
                </ul>
                <div className="review-card"><span>Next sensible step</span><strong>Review the team topology before connecting any tool or MCP runtime.</strong><button className="button ghost" type="button" onClick={() => setActiveView('canvas')}>Open Swarm Canvas</button></div>
              </aside>
            </div>
          </section>
        )}

        {activeView === 'canvas' && (
          <section className="view canvas-view" aria-labelledby="canvas-heading">
            <div className="section-heading"><p className="eyebrow">Swarm Canvas</p><h1 id="canvas-heading">Authority flows down. Receipts come back.</h1><p>Visualize the proposed topology before it becomes a configured harness. This is an inspectable blueprint, not live telemetry.</p></div>
            <div className="canvas-legend"><span><i className="legend sovereign" /> Sovereign</span><span><i className="legend policy" /> Policy lock</span><span><i className="legend queen" /> Queen</span><span><i className="legend worker" /> Worker</span></div>
            <section className="swarm-canvas" aria-label="Harness topology">
              <div className="topology-row sovereign-row">
                {topology.nodes.filter((node) => node.kind === 'sovereign').map((node) => <article className={`topology-node ${node.kind}`} key={node.id}><span>{nodeGlyph(node.kind)}</span><strong>{node.label}</strong><small>sets mandate</small></article>)}
              </div>
              <div className="connector-label">policy and mandate</div>
              <div className="topology-row policy-row">
                {topology.nodes.filter((node) => node.kind === 'policy').map((node) => <article className={`topology-node ${node.kind}`} key={node.id}><span>{nodeGlyph(node.kind)}</span><strong>{node.label}</strong><small>non-negotiable</small></article>)}
              </div>
              <div className="topology-grid">
                {harness.teams.map((team) => <section className="team-lane" key={team.id} aria-label={team.name}>
                  <article className="topology-node queen"><span>Q</span><strong>{team.queen.label}</strong><small>{team.queen.provider} / {team.queen.model}</small></article>
                  <div className="lane-line" aria-hidden="true" />
                  <article className="team-label"><span>{team.name}</span><small>reviewed lane</small></article>
                  <div className="worker-stack">
                    {team.workers.map((worker) => <article className="topology-node worker" key={worker.id}><span>W</span><strong>{worker.label}</strong><small>{worker.permissions?.join(' · ')}</small></article>)}
                  </div>
                </section>)}
              </div>
              <div className="return-path">Every worker returns evidence to its Queen → human escalation when the contract says so.</div>
            </section>
          </section>
        )}

        {activeView === 'teams' && (
          <section className="view teams-view" aria-labelledby="teams-heading">
            <div className="section-heading"><p className="eyebrow">Agentic Teams</p><h1 id="teams-heading">Teams are contracts, not character prompts.</h1><p>Every role has a purpose, model lane, capability boundary, and escalation path. This is how a swarm stays understandable as it grows.</p></div>
            <div className="team-table" role="table" aria-label="Agentic team contracts">
              <div className="table-head" role="row"><span role="columnheader">Team / role</span><span role="columnheader">Lane</span><span role="columnheader">Capability boundary</span><span role="columnheader">Return condition</span></div>
              {harness.teams.map((team) => <div className="team-group" key={team.id} role="rowgroup">
                <div className="team-row queen-row" role="row"><span role="cell"><b>{team.name}</b><small>{team.queen.label}</small></span><span role="cell">{team.queen.provider} / {team.queen.model}</span><span role="cell">Coordinates only; cannot bypass policy locks</span><span role="cell">Routes reviewed synthesis</span></div>
                {team.workers.map((worker) => <div className="team-row" key={worker.id} role="row"><span role="cell"><b>{worker.label}</b><small>Worker</small></span><span role="cell">{worker.provider} / {worker.model}</span><span role="cell">{worker.permissions?.join(' · ')}</span><span role="cell">Evidence + handoff receipt</span></div>)}
              </div>)}
            </div>
            <aside className="team-callout"><span>Starlight Teams principle</span><p>Use the best available model for the job, but never allow provider choice to erase ownership, policy, or an operator’s right to say no.</p></aside>
          </section>
        )}

        {activeView === 'mcp' && (
          <section className="view mcp-view" aria-labelledby="mcp-heading">
            <div className="section-heading"><p className="eyebrow">MCP Bridge</p><h1 id="mcp-heading">Connect systems without giving away the keys.</h1><p>Start with a portable harness contract. A later MCP server can read sanitized state and propose actions; any write, spend, deployment, or external communication remains operator-approved.</p></div>
            <div className="bridge-grid">
              <section className="bridge-panel"><p className="eyebrow">Now / browser-local</p><h2>Portable harness manifest</h2><p>Export a versioned JSON contract for a team, its roles, bounded permissions, policy locks, and escalation rules.</p><button className="button primary" type="button" onClick={exportManifest}>Export portable manifest <span aria-hidden="true">↓</span></button>{notice && <p className="notice" role="status">{notice}</p>}</section>
              <section className="bridge-panel"><p className="eyebrow">Import / local review</p><h2>Bring a blueprint back in</h2><p>Imported manifests are validated in the browser. Invalid files do not alter the current working harness.</p><label className="file-input">Import a portable manifest<input aria-label="Import a portable manifest" type="file" accept="application/json,.json" onChange={importManifest} /></label>{importError && <p className="error" role="alert">{importError}</p>}</section>
              <section className="bridge-panel span-two"><p className="eyebrow">Later / explicit integration</p><h2>Read-only MCP first. Receipts before writes.</h2><div className="mcp-path"><span>Harness schema</span><i>→</i><span>Local MCP adapter</span><i>→</i><span>Read-only topology + health</span><i>→</i><span>Human-approved action</span></div><ul><li>No transcripts, prompts, vault contents, credentials, or local paths belong in this portable contract.</li><li>Agent runtimes should return a structured receipt: source, action, result, evaluator, and escalation status.</li><li>Railway or a private local daemon belongs behind the explicit approval boundary—not inside a static marketing page.</li></ul></section>
            </div>
          </section>
        )}
      </section>
    </main>
  )
}

export default App
