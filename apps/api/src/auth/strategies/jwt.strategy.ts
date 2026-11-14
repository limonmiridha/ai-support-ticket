import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        const accessSecret = process.env.JWT_ACCESS_SECRET;

        if (!accessSecret) {
            throw new Error('JWT_ACCESS_SECRET is not defined');
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: accessSecret,
        });
    }

    async validate(payload: any) {
        if (!payload.organizationId || !payload.sub) {
            throw new UnauthorizedException();
        }

        return {
            userId: payload.sub,
            email: payload.email,
            name: payload.name,
            organizationId: payload.organizationId,
            role: payload.role,
        };
    }
}