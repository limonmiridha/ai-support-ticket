import {
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Req,
    UseGuards,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';

import { Request } from 'express';
import { Role } from '@prisma/client';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { AiService } from './ai.service';
import { PrismaService } from '../prisma/prisma.service';

type AuthenticatedRequest = Request & {
    user: {
        id: string;
        role: Role;
    };
};

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class AiController {
    constructor(
        private readonly aiService: AiService,
        private readonly prisma: PrismaService,
    ) { }

    @Post(':id/analyze')
    async analyzeTicket(
        @Param('id', ParseUUIDPipe) ticketId: string,
        @Req() req: AuthenticatedRequest,
    ) {
        const user = req.user;

        const ticket = await this.prisma.ticket.findFirst({
            where: {
                id: ticketId,

                ...(user.role === Role.ADMIN
                    ? {}
                    : { customerId: user.id }),
            },
        });

        if (!ticket) {
            throw new NotFoundException(
                'Ticket not found',
            );
        }

        const result = await this.aiService.analyzeTicket(
            `
Title: ${ticket.title}

Description:
${ticket.description}
      `,
        );

        const { analysis, metadata } = result;

        const savedAnalysis = await this.prisma.$transaction(
            async (tx) => {
                await tx.ticket.update({
                    where: {
                        id: ticket.id,
                    },

                    data: {
                        category: analysis.category,
                        priority: analysis.priority,
                    },
                });

                return tx.aiAnalysis.upsert({
                    where: {
                        ticketId: ticket.id,
                    },

                    create: {
                        ticketId: ticket.id,

                        category: analysis.category,
                        priority: analysis.priority,
                        sentiment: analysis.sentiment,

                        summary: analysis.summary,
                        suggestedReply: analysis.suggestedReply,
                        recommendedAction:
                            analysis.recommendedAction,

                        model: metadata.model,
                        promptVersion: metadata.promptVersion,

                        inputTokens: metadata.inputTokens,
                        outputTokens: metadata.outputTokens,
                        totalTokens: metadata.totalTokens,
                    },

                    update: {
                        category: analysis.category,
                        priority: analysis.priority,
                        sentiment: analysis.sentiment,

                        summary: analysis.summary,
                        suggestedReply: analysis.suggestedReply,
                        recommendedAction:
                            analysis.recommendedAction,

                        model: metadata.model,
                        promptVersion: metadata.promptVersion,

                        inputTokens: metadata.inputTokens,
                        outputTokens: metadata.outputTokens,
                        totalTokens: metadata.totalTokens,
                    },
                });
            },
        );

        return {
            message: 'Ticket analyzed successfully',

            data: {
                ticketId: ticket.id,
                analysis: savedAnalysis,
            },
        };
    }

    @Get(':id/analysis')
    async getTicketAnalysis(
        @Param('id', ParseUUIDPipe) ticketId: string,
        @Req() req: AuthenticatedRequest,
    ) {
        const user = req.user;

        const ticket = await this.prisma.ticket.findFirst({
            where: {
                id: ticketId,

                ...(user.role === Role.ADMIN
                    ? {}
                    : { customerId: user.id }),
            },

            include: {
                aiAnalysis: true,
            },
        });

        if (!ticket) {
            throw new NotFoundException(
                'Ticket not found',
            );
        }

        if (!ticket.aiAnalysis) {
            throw new NotFoundException(
                'AI analysis not found for this ticket',
            );
        }

        return {
            message: 'AI analysis retrieved successfully',
            data: ticket.aiAnalysis,
        };
    }
}