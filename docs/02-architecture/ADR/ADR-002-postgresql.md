
# ADR-002: Use PostgreSQL as the Primary Database

**Status:** Accepted

## Context

SupportAI contains highly relational business data,
including organizations, memberships, tickets,
conversations, subscriptions, and payments.

## Decision

Use PostgreSQL as the primary relational database.

Use Prisma as the initial ORM and migration tool.

Use pgvector for vector storage and similarity search.

## Alternatives

- MongoDB
- MySQL
- PostgreSQL

## Consequences

We gain relational constraints, ACID transactions,
SQL querying, indexing, and pgvector integration.

We must design relationships and migrations carefully.
