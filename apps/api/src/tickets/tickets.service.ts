import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketCategory, TicketPriority, TicketStatus } from '@prisma/client';

@Injectable()
export class TicketsService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(dto: CreateTicketDto,
        userId: string,
        organizationId: string,) {
        return this.prisma.ticket.create({
            data: {
                title: dto.subject.trim(),
                description: dto.description.trim(),
                customerId: userId,
                organizationId: organizationId,
                status: TicketStatus.OPEN,
                priority: TicketPriority.MEDIUM,
                category: TicketCategory.OTHER,
            },
        });
    }
}