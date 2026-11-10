
# Entity Relationship Design (ERD)

# SupportAI Database Architecture

**Database:** PostgreSQL  
**ORM:** Prisma  
**Vector Extension:** pgvector  
**Primary Key Strategy:** UUID

---

## 1. Database Design Overview

SupportAI uses a relational database architecture.

The database is designed to support:

- Multiple organizations.
- Organization membership and permissions.
- Customer support tickets.
- Ticket conversations.
- Knowledge-base documents.
- AI executions.
- Subscriptions and payments.
- Notifications and audit history.

The initial architecture uses a shared database
and shared schema for all organizations.

## 2. Entity Groups

### Identity and Organization

- User
- Organization
- OrganizationMember
- Invitation
- CustomerProfile

### Ticket Management

- Ticket
- TicketMessage
- TicketAssignment
- TicketTag
- Tag
- Attachment

### AI and Knowledge Base

- KnowledgeDocument
- DocumentChunk
- AIExecution
- AIApproval

### Billing

- Subscription
- Payment
- Invoice
- WebhookEvent

### Operations

- Notification
- AuditLog

## 3. Core Relationships

### User and Organization

- A user can belong to multiple organizations.
- An organization can contain multiple users.
- OrganizationMember connects users and organizations.
- A membership contains an organization-specific role.

Relationship:

User 1:N OrganizationMember  
Organization 1:N OrganizationMember

### Organization and Ticket

- An organization owns multiple tickets.
- Each ticket belongs to exactly one organization.
- Each ticket belongs to a customer profile.

Relationship:

Organization 1:N Ticket  
CustomerProfile 1:N Ticket

### Ticket and Conversation

- A ticket contains multiple messages.
- A message belongs to one ticket.
- A message has one author.
- Messages can be public or internal.

Relationship:

Ticket 1:N TicketMessage  
User 1:N TicketMessage

### Ticket and Assignment

- A ticket can have multiple assignment history records.
- Each assignment identifies the assigned agent.
- Assignment history must be retained.

### Organization and Knowledge Base

- An organization owns multiple documents.
- A document contains multiple chunks.
- Each chunk stores extracted text and an embedding.
- Retrieval must be restricted to the correct organization.

Relationship:

Organization 1:N KnowledgeDocument  
KnowledgeDocument 1:N DocumentChunk

### Organization and Billing

- An organization has subscription records.
- A subscription can have multiple payment records.
- Payment provider references must be unique.
- Webhook events must be deduplicated.

## 4. Database Constraints

The following constraints are important:

1. User email must be unique.
2. Organization slug must be unique.
3. An organization membership must be unique
   for each organization and user combination.
4. Ticket identifiers must be unique.
5. Ticket messages must reference valid tickets.
6. Ticket and message organization ownership
   must be consistent.
7. Payment provider references must be unique
   within the appropriate provider scope.
8. Webhook event identifiers must be unique
   within their provider scope.
9. Document chunks must reference valid documents.
10. Organization-owned data must not reference
    records belonging to another organization.

## 5. Indexing Strategy

Initial index candidates:

### User

- email UNIQUE

### Organization

- slug UNIQUE

### OrganizationMember

- (organization_id, user_id) UNIQUE
- (user_id, role)

### Ticket

- (organization_id, status, created_at)
- (organization_id, priority, created_at)
- (organization_id, assigned_agent_id, status)
- (organization_id, customer_id, created_at)

### TicketMessage

- (ticket_id, created_at)

### KnowledgeDocument

- (organization_id, status)

### DocumentChunk

- vector similarity index.
- (organization_id, document_id)

### Payment

- provider reference UNIQUE.
- (subscription_id, created_at)

Indexes must be validated against actual query patterns
and execution plans.

## 6. Tenant Isolation

Every organization-owned record must have a clear
tenant ownership path.

For sensitive relationships, composite foreign keys
may be used to prevent cross-organization references.

PostgreSQL Row-Level Security may provide an
additional protection layer.

Application services must always establish the
authenticated organization context.

## 7. Data Lifecycle

### Ticket Lifecycle

OPEN
  -> IN_PROGRESS
  -> WAITING_FOR_CUSTOMER
  -> RESOLVED
  -> CLOSED

Reopening a resolved ticket must follow explicit
business rules.

### Knowledge Document Lifecycle

UPLOADED
  -> PROCESSING
  -> READY

Failure states:

FAILED

Updated documents must invalidate or replace their
previous searchable chunks.

### Subscription Lifecycle

TRIALING
  -> ACTIVE
  -> PAST_DUE
  -> CANCELED
  -> EXPIRED

Actual transitions depend on payment provider events
and business rules.

## 8. Future Database Considerations

As the application grows, we will evaluate:

- Read replicas.
- Connection pooling.
- Partitioning for high-volume tables.
- Archival strategies for old audit records.
- Vector indexing performance.
- Full-text search.
- Database backup and point-in-time recovery.

## 9. Implementation Status

This document represents the initial logical database
design.

The detailed physical schema, Prisma models,
foreign-key definitions, indexes, and migrations
will be implemented and reviewed during Day 2.
