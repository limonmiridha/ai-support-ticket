
# ADR-009: Shared Database with Tenant Isolation

**Status:** Accepted

## Context

SupportAI serves multiple organizations.

Their private information must remain isolated.

## Decision

Use a shared PostgreSQL database and shared schema
with organization-scoped records.

Enforce isolation through server-side authorization,
tenant-aware queries, relational constraints, and
additional PostgreSQL Row-Level Security where appropriate.

## Consequences

Infrastructure is simpler initially.

Tenant isolation becomes a critical cross-cutting
requirement and must be tested at every data boundary.
