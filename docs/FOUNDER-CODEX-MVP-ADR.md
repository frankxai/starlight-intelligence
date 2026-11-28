# Founder Codex MVP — Architecture Decision Record
Status: PROPOSED / draft PR #16, not production approved
Date: 2026-11-23

## Ownership
- Starlight Intelligence: portable invention domain, events, approval boundary and workspace experience.
- Starlight Canvas: creative director graph and studio; reuse interaction patterns through explicit adapter, no shared mutable store.
- Starlight Intelligence System (SIS): canonical memory and orchestration authority; do not duplicate.
- Starlight Swarm: governed execution contracts; live runtime not presumed.
- GenCreator: creator assets, content production and publication review; no automatic publishing.
- GitHub/Drive/Figma: remain authorities for source code/documents/design source; Codex stores references and snapshots only when licensed and authorized.
- Agentic Ops: policy templates and operational coordination.

## Portable domain
Invention {schema,id,title,originalNote,author,createdAt,references,relations,missions,events}.
Event {id,sequence,at,actor,type,previousEventId,payload}.
ArtifactRef {id,url,label,provider,verified}; never infer external access from a pasted URL.
Mission {id,brief,assignee,budget,status,evidence}; review requires submitted evidence.
Reconstruction is an event projection; event timestamp is descriptive, sequence defines ordering.

## Boundaries
The pure model in src/codex/codex-model.js is experimental. Its in-memory events are not tamper-proof or cryptographically signed; server persistence, authorization, multi-user concurrency, integrity checks and secure import validation are still required. Export does not automatically redact arbitrary user-entered text, tokens in query strings, or event payloads; treat output as private until reviewed.

## Screen map
/codex — notebook and invention library
/codex/inventions/:id — dossier, evidence and timeline
/codex/inventions/:id/canvas — relation graph
/codex/inventions/:id/missions — bounded assignments and approvals
/codex/inventions/:id/history — deterministic revision replay
/codex/inventions/:id/export — portable data export
Routes are planned; the current prototype is an isolated static file at public/codex-demo.html.

## Release gates
1. Browser smoke: create note/sketch invention and reload.
2. Source integration: verify GitHub repository read via authenticated adapter and document permission boundary.
3. Canvas: persist actual spatial edges and positions, provide keyboard-accessible graph/list.
4. Agent: execute an authorized dry-run, attach real verifiable evidence, require human review.
5. History: reconstruct previous graph and decisions after restart, with consistency tests.
6. Export: schema validation, import roundtrip, provenance preservation, secrets review.
7. CI: typecheck, lint, unit, integration, Playwright and axe accessibility.
8. Deployment: actual Vercel preview URL, correct Git commit, successful browser smoke and no public data exposure.
9. Review: no merge before all gates pass.

## Sequence
A. Stabilize model and tests, correct import/export threat model.
B. Wire UI to model, implement persistence and deterministic replay.
C. Add adapters for GitHub and Drive read-only links with explicit access state.
D. Integrate canvas and agent evidence; end-to-end tests.
E. Deploy preview, collect verification evidence, then decide on merge.
