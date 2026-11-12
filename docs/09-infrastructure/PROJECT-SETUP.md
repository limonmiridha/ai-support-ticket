
# Day 02 - Project Setup and Database Engineering

## 1. Objective

Establish the technical foundation of SupportAI using a pnpm
monorepo, Next.js, NestJS, PostgreSQL, Docker and Prisma.

## 2. Technology Decisions

- Monorepo: pnpm workspace
- Frontend: Next.js App Router + TypeScript
- Backend: NestJS + TypeScript
- Database: PostgreSQL
- Database ORM: Prisma
- Local infrastructure: Docker Compose

## 3. Repository Structure

- apps/web: Frontend application
- apps/api: Backend application
- apps/worker: Future background worker
- packages/shared: Shared types and utilities
- docs: Project documentation

## 4. Database Models

### User
- id
- name
- email
- passwordHash
- role
- createdAt
- updatedAt

### Ticket
- id
- title
- description
- status
- priority
- customerId
- createdAt
- updatedAt

### AiAnalysis
- id
- ticketId
- summary
- sentiment
- suggestedReply
- confidence
- createdAt
- updatedAt

## 5. Database Relationships

- One User can create multiple Tickets.
- One Ticket can have zero or one AiAnalysis.
- A Ticket belongs to one User.

## 6. Database Indexes

- User.email: Unique index
- User.role: Index
- Ticket.customerId + createdAt: Composite index
- Ticket.status + priority: Composite index
- AiAnalysis.ticketId: Unique index

## 7. Migration Strategy

Development:
prisma migrate dev

Production:
prisma migrate deploy

Every database schema change must have a committed migration.

## 8. Environment Variables

- PORT
- DATABASE_URL

Secrets must never be committed to Git.

## 9. Verification

- Frontend starts successfully.
- Backend starts successfully.
- PostgreSQL container is healthy.
- Prisma Client generates successfully.
- Initial database migration succeeds.
- NestJS can execute a database query.

## 10. Completion Status

[ ] Monorepo created
[ ] Next.js application running
[ ] NestJS application running
[ ] PostgreSQL running
[ ] Prisma configured
[ ] Initial migration created
[ ] Database connectivity verified
[ ] Documentation updated
