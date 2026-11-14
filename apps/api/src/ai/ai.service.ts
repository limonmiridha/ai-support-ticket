import {
    Injectable,
    InternalServerErrorException,
    Logger,
    GatewayTimeoutException,
    ServiceUnavailableException,
    BadGatewayException,
} from '@nestjs/common';

import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';

import {
    TicketAnalysisSchema,
} from './schemas/ticket-analysis.schema';

import {
    TICKET_ANALYSIS_PROMPT_VERSION,
    TICKET_ANALYSIS_SYSTEM_PROMPT,
} from './prompts/ticket-analysis.prompt';
import { Sentiment, TicketCategory, TicketPriority } from '@prisma/client';

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);

    private readonly openai: OpenAI;

    private readonly model =
        process.env.OPENAI_MODEL || 'gpt-5.5';

    constructor() {
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            throw new Error('OPENAI_API_KEY is missing');
        }

        this.openai = new OpenAI({
            apiKey,
            timeout: 20000,
            maxRetries: 0,
        });
    }

    async analyzeTicket(ticketContent: string) {
        if (process.env.AI_PROVIDER === 'mock') {
            return this.analyzeWithMock(ticketContent);
        }
        try {
            const response = await this.openai.responses.parse({
                model: this.model,

                instructions: TICKET_ANALYSIS_SYSTEM_PROMPT,

                input: [
                    {
                        role: 'user',
                        content: `
Analyze this customer support ticket.

<ticket_content>
${ticketContent}
</ticket_content>
            `,
                    },
                ],

                text: {
                    format: zodTextFormat(
                        TicketAnalysisSchema,
                        'ticket_analysis',
                    ),
                },

                store: false,
            });

            if (response.status === 'incomplete') {
                throw new BadGatewayException(
                    'AI generated an incomplete response',
                );
            }

            if (response.status !== 'completed') {
                throw new BadGatewayException(
                    'AI could not complete the analysis',
                );
            }

            const refusal = response.output.some((item) =>
                item.type === 'message' &&
                item.content.some(
                    (content) => content.type === 'refusal',
                ),
            );

            if (refusal) {
                throw new BadGatewayException(
                    'AI refused to analyze this ticket',
                );
            }

            const analysis = response.output_parsed;

            if (!analysis) {
                throw new BadGatewayException(
                    'AI returned no valid analysis',
                );
            }

            return {
                analysis,

                metadata: {
                    model: this.model,
                    promptVersion: TICKET_ANALYSIS_PROMPT_VERSION,

                    inputTokens:
                        response.usage?.input_tokens ?? 0,

                    outputTokens:
                        response.usage?.output_tokens ?? 0,

                    totalTokens:
                        response.usage?.total_tokens ?? 0,
                },
            };
        } catch (error: any) {
            console.error('AI PROVIDER ERROR:', {
                message: error.message,
                status: error.status ?? error.response?.status,
                code: error.code,
                details: error.error ?? error.response?.data,
            });
            if (
                error instanceof BadGatewayException ||
                error instanceof GatewayTimeoutException
            ) {
                throw error;
            }

            this.logger.error(
                'OpenAI analysis failed',
                error instanceof Error
                    ? error.stack
                    : String(error),
            );

            if (
                error instanceof OpenAI.APIConnectionTimeoutError
            ) {
                throw new GatewayTimeoutException(
                    'AI request timed out',
                );
            }

            if (
                error instanceof OpenAI.APIConnectionError
            ) {
                throw new ServiceUnavailableException(
                    'AI provider is unavailable',
                );
            }

            if (error instanceof OpenAI.APIError) {
                throw new BadGatewayException(
                    'AI provider returned an error',
                );
            }

            throw new InternalServerErrorException(
                'Unable to analyze ticket',
            );
        }
    }
    private analyzeWithMock(ticketText: string) {
        const text = ticketText.toLowerCase();

        let category: TicketCategory = TicketCategory.OTHER;
        let priority: TicketPriority = TicketPriority.MEDIUM;
        let sentiment: Sentiment = Sentiment.NEUTRAL;

        // Category detection
        if (
            text.includes('payment') ||
            text.includes('billing') ||
            text.includes('invoice') ||
            text.includes('refund')
        ) {
            category = TicketCategory.BILLING;
        } else if (
            text.includes('delivery') ||
            text.includes('shipping') ||
            text.includes('shipment')
        ) {
            category = TicketCategory.DELIVERY;
        } else if (
            text.includes('product') ||
            text.includes('damaged') ||
            text.includes('broken')
        ) {
            category = TicketCategory.PRODUCT_ISSUE;
        } else if (
            text.includes('technical') ||
            text.includes('error') ||
            text.includes('bug') ||
            text.includes('crash') ||
            text.includes('login')
        ) {
            category = TicketCategory.TECHNICAL;
        }

        // Priority detection
        if (
            text.includes('urgent') ||
            text.includes('critical') ||
            text.includes('immediately')
        ) {
            priority = TicketPriority.URGENT;
        } else if (
            text.includes('important') ||
            text.includes('cannot') ||
            text.includes('unable')
        ) {
            priority = TicketPriority.HIGH;
        } else if (
            text.includes('minor') ||
            text.includes('small issue')
        ) {
            priority = TicketPriority.LOW;
        }

        // Sentiment detection
        if (
            text.includes('angry') ||
            text.includes('terrible') ||
            text.includes('frustrated') ||
            text.includes('disappointed')
        ) {
            sentiment = Sentiment.NEGATIVE;
        } else if (
            text.includes('thank you') ||
            text.includes('great') ||
            text.includes('excellent')
        ) {
            sentiment = Sentiment.POSITIVE;
        }

        return {
            analysis: {
                category,
                priority,
                sentiment,
                summary: `This ticket concerns ${category.toLowerCase().replace('_', ' ')}. The detected priority is ${priority.toLowerCase()}.`,
                suggestedReply:
                    'Thank you for contacting our support team. We have received your request and our team will investigate the issue. We will update you as soon as possible.',
                recommendedAction:
                    'Review the reported issue, investigate its cause, and provide an appropriate resolution to the customer.',
            },
            metadata: {
                model: 'mock-ai-v1',
                promptVersion: 'mock-v1',
                inputTokens: 0,
                outputTokens: 0,
                totalTokens: 0,
            },
        };
    }
}