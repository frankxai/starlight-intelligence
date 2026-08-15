# Starlight Pro + Agentic Teams Implementation Plan

> **For Hermes:** Execute this plan with test-first tracer bullets and an independent pre-commit review.

**Goal:** Build a premium, truthful, static-first Starlight platform that helps operators define an agent harness, inspect a visual swarm topology, generate/import/export a portable harness manifest, and understand the safe MCP bridge path.

**Architecture:** Implement a Vite + React + TypeScript single-page control surface in the empty public `frankxai/starlight-intelligence` repository. Keep all current functionality browser-local and explicitly labeled as a design/workbench rather than a live controller. Pure harness-manifest validation and topology generation live in `src/lib/`; React UI consumes a typed demo manifest and supports draft edits plus JSON export/import. A later stdio MCP server may read the same versioned manifest and emit only sanitized, receipt-based state.

**Tech stack:** React 19, TypeScript, Vite, Vitest, Testing Library, CSS custom properties, static Vercel deployment.

## Product slices

### Task 1 — Establish typed harness contracts

**Files**
- Create: `src/lib/harness.ts`
- Create: `src/lib/harness.test.ts`

**Test-first behavior**
1. A harness validates only when it has a unique team ID, one sovereign owner, at least one Queen, bounded worker permissions, and an explicit human escalation.
2. A topology projection groups Sovereign → policy locks → Queen → teams → workers.
3. Export sanitizes local paths, session IDs, hostnames, prompts, tokens, and arbitrary runtime state.

**Verification:** `pnpm test --run src/lib/harness.test.ts` fails before the module exists, then passes after the minimal implementation.

### Task 2 — Create a visual Starlight workspace

**Files**
- Replace: `src/App.tsx`
- Replace: `src/App.css`
- Replace: `src/index.css`
- Create: `src/data/demoHarness.ts`

**Behavior**
- Overview with truthfully labeled local demo state and lifecycle metrics.
- Harness Builder to edit a typed team name, mission, approval threshold, and create a portable blueprint.
- Swarm Canvas with inspectable agent cards and connection paths.
- Teams panel with role contracts, model-lane routing, capability limits, and escalation rules.
- MCP Bridge panel that explains read-only-first integration and presents an exportable `starlight.harness/v1` manifest.
- Full keyboard navigation, focus styles, semantic landmarks, reduced-motion support, mobile layout, and no fabricated live telemetry.

### Task 3 — Add interactive behavior tests

**Files**
- Create: `src/App.test.tsx`
- Create: `src/test/setup.ts`
- Modify: `vite.config.ts`
- Modify: `package.json`

**Test-first behavior**
1. Switching to Harness Builder reveals editable constraints.
2. Changing the approval threshold updates the local plan state.
3. Export produces a downloadable sanitized JSON manifest.
4. Import rejects an invalid manifest without mutating the working harness.

**Verification:** observe failing UI tests, implement only enough state handling to pass, then run the full suite.

### Task 4 — Package a safe MCP-ready contract

**Files**
- Create: `public/starlight-harness.schema.json`
- Create: `public/mcp/starlight-pro.mcp.json`
- Create: `docs/MCP-BRIDGE.md`
- Create: `docs/PRODUCT-TRUTH.md`

**Behavior**
- The public schema defines a portable, non-secret harness blueprint.
- The MCP config is documentation-only and does not expose credentials or grant writes.
- Documentation separates current browser-local features from future read-only MCP, Railway, and operator-approved write paths.

### Task 5 — Verify and ship safely

**Commands**
1. `pnpm install --frozen-lockfile`
2. `pnpm test --run`
3. `pnpm lint`
4. `pnpm build`
5. Launch preview locally and capture desktop + mobile screenshots.
6. Verify keyboard focus, reduced motion, no horizontal overflow, and discovery file delivery.
7. `git diff --check` and scoped secret scan.
8. Independent code review, then commit/push/open a draft PR and create a Vercel preview only if all gates pass.

**Scope boundaries**
- Do not attach purchased domains or merge to main.
- Do not claim live agent execution, session telemetry, model access, payments, or remote memory sync.
- Do not send, store, or expose prompts, paths, credentials, or private vault data.
