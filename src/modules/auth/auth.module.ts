import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from '../../common/common.module';
import { EmailService } from './services/email.service';
import { ProfileModule } from '../profile/profile.module';

/**
 * Module responsible for handling authentication strategies,
 * user login, and issuing JWT tokens.
 */
@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SECRET');

        if (!jwtSecret) {
          throw new Error(
            '❌ CRITICAL FAILURE: JWT_SECRET is not defined in .env!',
          );
        }

        return {
          secret: jwtSecret,
          signOptions: { expiresIn: '7d' },
        };
      },
    }),
    CommonModule,
    UserModule,
    WorkspaceModule,
    ProfileModule,
  ],
  providers: [AuthService, JwtStrategy, EmailService],
  controllers: [AuthController],
  exports: [PassportModule, JwtStrategy, AuthService, JwtModule],
})
export class AuthModule {}
