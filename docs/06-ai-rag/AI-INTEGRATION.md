# Day 04 — AI Integration

## Objective

Integrate OpenAI into SupportAI to provide intelligent support ticket analysis.

## Implemented Components

- OpenAI Responses API integration
- Zod-based structured outputs
- Ticket classification
- Priority detection
- Customer sentiment analysis
- Ticket summarization
- Suggested customer responses
- Recommended support actions
- Prompt versioning
- API timeout and error handling
- Token usage tracking

## AI Analysis Output

The AI analysis produces:

1. Category
2. Priority
3. Sentiment
4. Summary
5. Suggested reply
6. Recommended action

## Architecture

Next.js → NestJS AI Module → OpenAI Responses API → Structured Output → PostgreSQL

## Security Considerations

- OpenAI API key remains backend-only.
- Customer ticket content is treated as untrusted input.
- AI output must be validated.
- AI-generated responses require human review.
- API requests have timeout limits.
- Tenant authorization must happen before retrieving ticket content.

## Prompt Management

Current prompt version: v1

Prompt location: `backend/src/ai/prompts/ticket-analysis.prompt.ts`

## Token Usage

Track:

- Input tokens
- Output tokens
- Total tokens
- Model
- Prompt version

## Remaining Work

- Integrate AI analysis with authorized ticket retrieval.
- Persist analysis results in PostgreSQL.
- Add analysis history.
- Add integration tests.
- Add AI cost tracking.

## Completion Criteria

- [ ] OpenAI API connection works.
- [ ] Structured output follows the Zod schema.
- [ ] API errors are handled safely.
- [ ] Token usage is captured.
- [ ] Ticket authorization is enforced.
- [ ] AI results are persisted.
- [ ] Integration tests pass.