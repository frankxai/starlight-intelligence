# Starlight Pro MCP Bridge

## Current release

The web platform is a **browser-local harness workbench**. It can:

- define a typed team/harness contract;
- show a proposed topology;
- validate governance boundaries;
- export and import a sanitized `starlight.harness/v1` JSON manifest.

It **does not** run agents, connect to a model, access a repository, read a vault, create a session, store data remotely, or expose any live machine telemetry.

## Why no live MCP server is bundled yet

An MCP server is useful only when it has a narrow, verifiable contract. Adding one directly to a public frontend would blur the trust boundary and risk a UI that appears to control more than it actually controls.

The correct next implementation is a **local stdio adapter** or authenticated private service that consumes the same versioned portable manifest.

## Integration policy

1. **Read-only first.** `harness_validate`, `harness_topology`, and `swarm_receipts_list` may return sanitized structured facts.
2. **No private payloads.** Prompts, transcripts, private vault content, credentials, session IDs, local paths and host identifiers never enter the portable manifest.
3. **Receipts before action.** Any runtime reports source, timestamp, action, result, evaluator and escalation status.
4. **Proposals, not silent writes.** A tool may propose an external write, spend, deployment or message. The sovereign operator explicitly approves the execution separately.
5. **Local-first authority.** SIS/local-core remains canonical for memory; a managed service is an accelerator, never the only source of truth.

## Future tool sketch

```ts
harness_validate({ manifest })
// -> { valid, issues, policy_summary }

harness_topology({ manifest })
// -> { nodes, edges, topology_version }

swarm_receipts_list({ harness_id, since })
// -> { receipts: SanitizedReceipt[] }

swarm_propose_action({ harness_id, proposal })
// -> { proposal_id, risk_class, required_approvals }
```

`swarm_propose_action` must never execute the action itself. A separate approved execution channel is required.

## Contract assets

- [`/starlight-harness.schema.json`](../public/starlight-harness.schema.json)
- [`/mcp/starlight-pro.mcp.json`](../public/mcp/starlight-pro.mcp.json)
