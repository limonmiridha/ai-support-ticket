
# ADR-001: Start with a Modular Monolith

**Status:** Accepted  
**Date:** November 2026  
**Decision Owner:** SupportAI Engineering

## 1. Context

SupportAI requires several business capabilities:

- Authentication.
- Organization management.
- Ticket management.
- Conversations.
- AI processing.
- Notifications.
- Billing.
- Real-time communication.

A microservices architecture could separate these
capabilities into independent services.

However, starting with microservices would introduce
additional operational complexity, including:

- Network communication.
- Distributed tracing.
- Service discovery.
- Distributed transactions.
- Event consistency.
- Independent deployments.
- More infrastructure and monitoring.

The project is being developed initially by a small
engineering team, so this complexity is not justified
at the beginning.

## 2. Decision

We will initially use a modular monolith.

The backend will be one NestJS application with
clearly separated modules and business boundaries.

The frontend and background worker will be separate
applications.

Each backend module must maintain clear ownership
of its business logic and data operations.

## 3. Alternatives Considered

### Option A: Microservices from Day 1

Advantages:
- Independent deployment.
- Independent scaling.
- Strong service isolation.

Disadvantages:
- Distributed system complexity.
- More infrastructure.
- Difficult local development.
- Additional communication and failure handling.

### Option B: Traditional Monolith

Advantages:
- Simple deployment.
- Simple communication.
- Easy initial development.

Disadvantages:
- Weak module boundaries can create tight coupling.
- Difficult future extraction.

### Option C: Modular Monolith

Advantages:
- Clear business boundaries.
- Simple initial deployment.
- Easier testing.
- Direct internal communication.
- Future service extraction is possible.

Disadvantages:
- Modules still share one deployment.
- Database boundaries require discipline.

## 4. Consequences

We accept the modular monolith approach.

Future microservices will be extracted only when
independent scaling, deployment, reliability, or
organizational ownership provides a measurable benefit.

## 5. Review Conditions

Revisit this decision when:

- AI processing requires independent scaling.
- Notification traffic becomes significantly different
  from API traffic.
- Billing requires independent operational controls.
- Realtime connections require separate scaling.
- Deployment coupling becomes a measurable problem.
