
# SupportAI

### AI-Powered Customer Support SaaS Platform

SupportAI is a multi-tenant customer support
platform that combines traditional ticket management,
real-time communication, AI-powered assistance,
Retrieval-Augmented Generation (RAG), and controlled
AI agent workflows.

## Key Features

- Multi-tenant organization management
- Authentication and role-based access control
- Customer support ticket management
- Real-time conversations
- AI-powered ticket classification
- AI-generated response suggestions
- Knowledge-base-powered RAG
- Controlled autonomous AI agents
- Email notifications
- Subscription and payment management
- Business analytics
- Audit logging

## Technology Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- TanStack Query

### Backend
- NestJS
- PostgreSQL
- Prisma
- Redis
- BullMQ
- Socket.IO

### AI
- OpenAI API
- Embeddings
- pgvector
- RAG
- AI tool calling

### Infrastructure
- Docker
- Kubernetes
- GitHub Actions
- Prometheus
- Grafana

## Architecture

The initial implementation follows a modular monolith
architecture with separate frontend, API, and worker
applications.

The architecture is designed to evolve toward
independently deployable microservices when justified.

## Documentation

All project documentation is maintained in `/docs`.

Documentation includes:

- Product requirements
- Functional and non-functional requirements
- High-level architecture
- Low-level design
- Database design
- API documentation
- Security architecture
- AI and RAG architecture
- Real-time communication
- Billing architecture
- Infrastructure and deployment

## Project Status

Currently in the foundation and system design phase.

## Engineering Principles

- Security first
- Tenant isolation
- Test-driven quality
- Reliable background processing
- Human oversight for sensitive AI operations
- Documented architectural decisions
- Production observability
