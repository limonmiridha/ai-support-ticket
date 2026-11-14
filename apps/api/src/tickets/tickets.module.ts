import { Module } from '@nestjs/common';

import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
    imports: [PrismaModule],
    controllers: [TicketsController],
    providers: [
        TicketsService,
        RolesGuard,
    ],
    exports: [TicketsService],
})
export class TicketsModule { }