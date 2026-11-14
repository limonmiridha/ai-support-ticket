import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { RegisterDto } from './dto/register.dto';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

    constructor(private readonly jwtService: JwtService, private readonly prisma: PrismaService) { }

    async hashPassword(password: string): Promise<string> {
        return argon2.hash(password, {
            type: argon2.argon2id,
        });
    }

    async verifyPassword(
        password: string,
        passwordHash: string,
    ): Promise<boolean> {
        return argon2.verify(passwordHash, password);
    }

    async register(dto: RegisterDto) {
        const email = dto.email.trim().toLowerCase();

        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        const passwordHash = await argon2.hash(dto.password, {
            type: argon2.argon2id,
        });

        const slug = this.createOrganizationSlug(dto.organizationName);

        const result = await this.prisma.$transaction(async (tx) => {
            const organization = await tx.organization.create({
                data: {
                    name: dto.organizationName.trim(),
                    slug,
                },
            });

            const user = await tx.user.create({
                data: {
                    name: dto.name.trim(),
                    email,
                    passwordHash,
                },
            });

            const membership = await tx.membership.create({
                data: {
                    userId: user.id,
                    organizationId: organization.id,
                    role: 'ADMIN',
                },
            });

            return {
                user,
                organization,
                membership,
            };
        });

        // 6. Create access and refresh tokens
        const tokens = await this.createSession(
            result.user.id,
            result.user.email,
            result.user.name,
            result.organization.id,
            result.membership.role,
        );

        // 7. Return safe response
        const { passwordHash: _, ...safeUser } = result.user;

        return {
            message: 'Organization registered successfully',
            user: safeUser,
            organization: result.organization,
            tokens,
        };
    }
    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email.trim().toLowerCase(),
            },
            include: {
                memberships: {
                    where: {
                        organization: {
                            slug: dto.organizationSlug,
                        },
                    },
                    include: {
                        organization: true,
                    },
                },
            },
        });

        if (!user || !user.isActive) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isValid = await argon2.verify(
            user.passwordHash,
            dto.password,
        );

        if (!isValid || user.memberships.length === 0) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const membership = user.memberships[0];

        return this.createSession(
            user.id,
            user.email,
            user.name,
            membership.organizationId,
            membership.role,
        );
    }
    private createOrganizationSlug(name: string): string {
        return name
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    async createSession(
        userId: string,
        email: string,
        name: string,
        organizationId: string,
        role: Role,
    ) {
        const payload = {
            sub: userId,
            email,
            name,
            organizationId,
            role,
        };

        const accessToken = await this.jwtService.signAsync(
            payload,
            {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: '15m',
            },
        );

        const refreshToken = await this.jwtService.signAsync(
            {
                sub: userId,
                organizationId,
                type: 'refresh',
            },
            {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '7d',
            },
        );

        const tokenHash = await argon2.hash(refreshToken);

        await this.prisma.refreshToken.create({
            data: {
                tokenHash,
                userId,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        return { accessToken, refreshToken };
    }

}
