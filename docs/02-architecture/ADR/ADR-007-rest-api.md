
# ADR-007: Use REST APIs for Client Communication

**Status:** Accepted

## Context

The Next.js frontend needs a predictable interface
for communicating with the NestJS backend.

## Decision

Use REST APIs for standard request-response
operations.

Use Socket.IO for real-time events.

Use OpenAPI/Swagger for API documentation.

## Consequences

We have clear HTTP contracts, standard status codes,
and straightforward integration testing.

Real-time functionality remains separate from
ordinary REST request handling.
