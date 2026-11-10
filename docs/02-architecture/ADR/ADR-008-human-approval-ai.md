
# ADR-008: Require Human Approval for Sensitive AI Actions

**Status:** Accepted

## Context

AI agents may eventually perform ticket operations
and other business actions.

Unrestricted autonomous actions could create
security, financial, and customer-service risks.

## Decision

Require explicit human approval for sensitive actions.

All AI tools must use server-side authorization,
validated arguments, execution limits, and audit logs.

## Consequences

AI workflows become more controlled and auditable.

Some operations will require additional approval
steps before execution.
