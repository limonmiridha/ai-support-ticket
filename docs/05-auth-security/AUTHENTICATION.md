
# Authentication, Authorization & Multi-Tenancy

## 1. Objectives

Implement a secure authentication and authorization
foundation for SupportAI.

The system supports:
- User registration and login
- Password hashing with Argon2id
- JWT access tokens
- Refresh token rotation
- Role-based access control
- Organization membership
- Multi-tenant data isolation

## 2. Authentication Architecture

Authentication is responsible for verifying user identity.

Authorization determines what an authenticated user
is permitted to do.

The system uses:
- JWT access token: 15 minutes
- Refresh token: 7 days
- Argon2id password hashing
- HttpOnly refresh-token cookie
- NestJS Passport JWT strategy

## 3. Multi-Tenancy Architecture

SupportAI uses a shared database and shared application
architecture.

Each organization represents a tenant.

The database contains:
- User
- Organization
- Membership
- RefreshToken
- Ticket
- AiAnalysis

Membership connects users to organizations and defines
their organization-specific roles.

A user may belong to multiple organizations.

## 4. User Roles

CUSTOMER:
- Create tickets
- View own tickets
- Reply to own tickets

AGENT:
- View authorized organization tickets
- Manage assigned tickets
- Respond to customers

ADMIN:
- Manage organization users
- Manage organization tickets
- Access organization analytics

SUPER_ADMIN:
- Manage platform-level resources
- Perform explicitly authorized platform operations

## 5. JWT Token Design

Access token payload:

{
  "sub": "user-uuid",
  "email": "user@example.com",
  "organizationId": "organization-uuid",
  "role": "ADMIN"
}

Refresh tokens are stored as hashes in the database.

Refresh-token rotation invalidates the previous token
and issues a replacement.

## 6. Security Rules

1. Never store plain-text passwords.
2. Never expose password hashes through API responses.
3. Never store refresh tokens in localStorage.
4. Validate JWT signatures and expiration.
5. Enforce role-based authorization.
6. Enforce organization-level data isolation.
7. Never trust client-provided organization IDs.
8. Validate all incoming DTOs.
9. Rate-limit authentication endpoints.
10. Revoke refresh tokens during logout.
11. Detect refresh-token reuse.
12. Verify user and membership status.

## 7. API Endpoints

POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/auth/me

GET  /api/v1/organizations/current
GET  /api/v1/admin/users

## 8. Tenant Isolation

Every tenant-owned database query must be scoped
to the authenticated organization.

Example:

where: {
  id: ticketId,
  organizationId: user.organizationId
}

Customer-specific resources must additionally enforce
ownership or explicit access permissions.

## 9. Testing Requirements

- Successful registration
- Duplicate email rejection
- Successful login
- Invalid password rejection
- Unauthorized request rejection
- Role-based authorization
- Cross-tenant access prevention
- Expired token rejection
- Refresh token rotation
- Logout and token revocation

## 10. Completion Criteria

Authentication, authorization, refresh-token handling,
and tenant isolation must work before moving to the
ticket management implementation.

## 11. Architecture Decisions

ADR reference:
- ADR-003: Authentication and Session Management
- ADR-004: Multi-Tenant Data Isolation

Status: In Progress
