
# ADR-003: Use Prisma ORM

**Status:** Accepted

## Context

The NestJS backend requires type-safe database access,
schema management, and repeatable migrations.

## Decision

Use Prisma ORM with PostgreSQL.

## Alternatives

- TypeORM
- Drizzle ORM
- Raw SQL
- Prisma

## Consequences

We gain generated TypeScript types, migration tooling,
and a consistent database access layer.

Complex queries may still require carefully written
raw SQL when necessary.
