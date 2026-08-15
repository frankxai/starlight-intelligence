# Starlight Pro — Agentic Teams Workbench

A premium, browser-local command surface for designing a **governed agent harness** before attaching any live agent runtime.

![Status](https://img.shields.io/badge/status-prototype-c7efae?style=flat-square) ![Privacy](https://img.shields.io/badge/data-browser--local-101618?style=flat-square) ![Contract](https://img.shields.io/badge/contract-starlight.harness%2Fv1-7a9b63?style=flat-square)

## What is implemented

- **Starlight Pro Command Deck** — the product posture, system principles and contract health.
- **Harness Builder** — edit the harness mission, approval boundary and escalation owner.
- **Swarm Canvas** — inspect authority, policy locks, Queens and worker lanes.
- **Agentic Teams** — inspect role contracts, model lanes and bounded permissions.
- **MCP Bridge** — export/import a versioned, portable, sanitized manifest.
- **Typed domain contract** — validation, topology derivation and runtime-state sanitization.
- **Truthful product boundary** — no invisible telemetry, model calls or claimed live control.

## Run locally

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Quality gates:

```bash
pnpm test
pnpm lint
pnpm build
```

## Privacy and truth boundary

This is a static frontend prototype. It does **not** run agents, access private vaults, connect to GitHub/Vercel/Railway, call models, store user data, or include a running MCP server.

The only transferable artifact is a **sanitized harness blueprint**. It excludes local paths, session IDs, hostnames, prompts, transcripts, credentials and runtime state.

See:

- [`docs/PRODUCT-TRUTH.md`](docs/PRODUCT-TRUTH.md)
- [`docs/MCP-BRIDGE.md`](docs/MCP-BRIDGE.md)
- [`public/starlight-harness.schema.json`](public/starlight-harness.schema.json)

## Architecture direction

```text
Browser-local workbench
       │ portable starlight.harness/v1
       ▼
Private local MCP adapter / authenticated service
       │ sanitized receipts, read-only first
       ▼
Human-approved action boundary
       │
SIS canonical memory · ACOS skill execution · Railway service operations
```

A future adapter must be read-only by default. Any external write, spending action, deployment or message requires a separate explicit human approval.

## Repository role

This is the commercial/product-experience layer of the Starlight constellation. The open protocol and local-first sovereignty posture remain separate from hosted or managed operational capabilities.
