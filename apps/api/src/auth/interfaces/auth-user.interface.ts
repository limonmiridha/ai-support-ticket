import { Role } from '@prisma/client';

export interface AuthUser {
    userId: string;
    email: string;
    name: string;
    organizationId: string;
    role: Role;
}