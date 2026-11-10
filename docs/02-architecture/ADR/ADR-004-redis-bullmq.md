
# ADR-004: Use Redis and BullMQ

**Status:** Accepted

## Context

AI processing, email delivery, document ingestion,
and scheduled operations should not block API requests.

## Decision

Use Redis as the queue storage and BullMQ for
background job processing.

## Consequences

Jobs can be processed asynchronously with retries,
delays, concurrency controls, and failure tracking.

We must implement idempotent job handlers and
monitor failed jobs.
