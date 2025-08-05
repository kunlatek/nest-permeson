import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from 'src/enums/user-role.enum';

/**
 * JWT authentication strategy using Passport.
 * Extracts and validates JWT tokens from Authorization headers.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    if (!process.env.JWT_SECRET) {
      throw new Error('❌ JWT_SECRET is not defined!');
    }

    const extractToken = ExtractJwt.fromAuthHeaderAsBearerToken();

    super({
      jwtFromRequest: extractToken,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /**
   * Validates the extracted JWT payload.
   * Ensures the token contains necessary user information.
   */
  async validate(payload: any) {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid JWT token');
    }

    return {
      userId: payload.sub,
      workspaceId: payload.workspaceId,
    };
  }
}
