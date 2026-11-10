
# ADR-006: Use PostgreSQL pgvector for Initial RAG

**Status:** Accepted

## Context

The platform needs semantic search over
organization-specific knowledge documents.

## Decision

Use PostgreSQL with the pgvector extension initially.

## Alternatives

- Pinecone
- Weaviate
- Qdrant
- PostgreSQL pgvector

## Consequences

We can store relational document metadata and
embeddings within the same database.

Tenant filtering must be included in vector retrieval.

A dedicated vector database can be considered later
if measured performance or scale justifies it.
