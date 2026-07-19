# Product truth — Starlight Pro / Agentic Teams

## Shipped in this prototype

- A premium static operator interface for Starlight Pro and Agentic Teams.
- A browser-local Harness Builder that changes a local React state draft.
- A visual Swarm Canvas derived from the typed harness contract.
- Team role, provider/model-lane and permission-boundary views.
- Portable JSON export/import with runtime sanitization and input validation.
- A documented, read-only-first MCP integration boundary.

## Not shipped or claimed

- A hosted Starlight Pro subscription service.
- Live agent execution or orchestration.
- A connection to Hermes, Claude Code, Codex, Gemini, SIS, ACOS, GitHub, Vercel, Railway, Cloudflare or a user filesystem.
- Model calls, LLM responses, team collaboration, authentication, payments, persistence, telemetry or cloud synchronization.
- An MCP server process.

## Safety posture

This prototype has no application backend, no secret fields, no authentication and no remote data storage. Its portable manifest intentionally excludes runtime fields and must remain safe to inspect, version and share.

Any future connection to real agent runtimes should be private by default, append receipt-only operational data, and require explicit human approval for writes, external actions, spend and policy-impacting changes.
