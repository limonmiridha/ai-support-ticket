import { z } from 'zod';

export const TicketAnalysisSchema = z.object({
    category: z.enum([
        'PRODUCT_ISSUE',
        'BILLING',
        'DELIVERY',
        'TECHNICAL',
        'OTHER',
    ]),

    priority: z.enum([
        'LOW',
        'MEDIUM',
        'HIGH',
        'URGENT',
    ]),

    sentiment: z.enum([
        'POSITIVE',
        'NEUTRAL',
        'NEGATIVE',
    ]),


    summary: z.string(),

    suggestedReply: z.string(),

    recommendedAction: z.string(),
});

export type TicketAnalysis = z.infer<
    typeof TicketAnalysisSchema
>;