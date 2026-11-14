import {
    Body,
    Controller,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';

import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import { Role } from '@prisma/client';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';

@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketsController {
    constructor(
        private readonly ticketsService: TicketsService,
    ) { }

    @Post()
    @Roles(Role.ADMIN, Role.CUSTOMER)
    async create(
        @Body() dto: CreateTicketDto,
        @Req() req: AuthenticatedRequest,
    ) {
        return this.ticketsService.create(
            dto,
            req.user.userId,
            req.user.organizationId
        );
    }
}