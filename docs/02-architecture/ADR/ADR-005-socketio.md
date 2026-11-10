
# ADR-005: Use Socket.IO for Real-Time Communication

**Status:** Accepted

## Context

SupportAI requires real-time messaging, typing
indicators, agent presence, and ticket updates.

## Decision

Use Socket.IO through NestJS WebSocket Gateway.

Use a Redis adapter when multiple instances need
to distribute socket events.

## Consequences

We gain rooms, reconnection support, and event-based
communication.

The database remains the source of truth.
Clients must synchronize missed messages after
reconnection.
